import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { formatCurrency, formatDate, formatDateTime } from "../../../config/formatPrice";
import { Link } from "react-router-dom";
import { getIdBooking } from "../../../config/idBooking";

const CreateInvoice = ({ item }) => {
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 10; // Số lượng bản ghi trên mỗi trang
    const totalPages = Math.ceil(item?.length / itemsPerPage); // Tổng số trang


    // Lấy dữ liệu của trang hiện tại
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return item?.slice(startIndex, endIndex) || [];
    };

    // Xử lý khi chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Tạo phạm vi trang hiển thị (có thể thay đổi giới hạn này nếu cần)
    const pageRange = () => {
        const range = [];
        let startPage = currentPage - 2 > 0 ? currentPage - 2 : 1;
        let endPage = currentPage + 2 <= totalPages ? currentPage + 2 : totalPages;

        // Nếu có quá nhiều trang, chỉ hiển thị vài trang xung quanh trang hiện tại
        if (endPage - startPage < 4) {
            if (startPage === 1) endPage = Math.min(startPage + 4, totalPages);
            else if (endPage === totalPages) startPage = Math.max(endPage - 4, 1);
        }

        // Thêm các trang vào phạm vi
        for (let i = startPage; i <= endPage; i++) {
            range.push(i);
        }
        return range;
    };
    return (
        <div>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đặt phòng</th>
                        <th>Phòng</th>
                        <th>Khách hàng</th>
                        <th>Giờ nhận</th>
                        <th>Giờ trả</th>
                        <th>Tổng cộng</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {getCurrentPageItems() && getCurrentPageItems().length > 0 ? (
                        getCurrentPageItems().map((booking, index) => {
                            const roomNames = booking.bookingRooms
                                .map(room => room.room?.roomName.replace("Phòng ", ""))
                                .join(", ");
                            const totalPrice = booking.bookingRooms?.reduce(
                                (total, room) => total + (room.price || 0),
                                0
                            ) || 0;
                            const encodedIdBookingRoom = btoa(booking.bookingRooms[0]?.id);
                            const priceDiscount = booking.discountPercent !== null? ( totalPrice * booking.discountPercent ) / 100 : 0;

                            return (
                                <tr key={index} className="tr-center">
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td>{getIdBooking(booking?.id,booking?.createAt)}</td>
                                    <td>Phòng {roomNames}</td>
                                    <td>
                                        <strong style={{fontWeight: "500"}}>{booking.accountDto.fullname}</strong>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', }} >
                                            <i className="fa fa-pen" style={{ fontSize: '10px', marginRight: '6px', color: 'gray' }}></i>
                                            <span style={{ fontSize: '14px', color: 'gray', }} >
                                                {booking.descriptions || "Mô tả....."}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{formatDateTime(booking.startAt)}</td>
                                    <td>{formatDate(booking.endAt)}</td>
                                    <td>{formatCurrency(totalPrice - priceDiscount)}</td>
                                    <td style={{ color: "red" }}>
                                        {booking.statusBookingDto.statusBookingName}
                                    </td>
                                    <td>
                                        <Link to={`/employee/edit-room?idBookingRoom=${encodedIdBookingRoom}`}>
                                            <Button variant="outline-success">Chi tiết</Button>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">Không có dữ liệu đặt phòng.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className="pagination">
                {currentPage > 1 && (
                    <Button
                        variant="secondary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="page-link"
                        style={{ margin: "0 5px" }}
                    >
                        <i className="fas fa-angle-double-left text-secondary"></i>
                    </Button>
                )}
                {pageRange().map(page => (
                    <Button
                        key={page}
                        variant="success"
                        onClick={() => handlePageChange(page)}
                        className={`page-link ${currentPage === page ? "active" : ""}`}
                        style={{ margin: "0 5px" }}
                    >
                        {page}
                    </Button>
                ))}
                {currentPage < totalPages && (
                    <Button
                        variant="secondary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="page-link"
                        style={{ margin: "0 5px" }}
                    >
                        <i className="fas fa-angle-double-right text-secondary"></i>
                    </Button>
                )}
            </div>
        </div>
    )
}

export default CreateInvoice;