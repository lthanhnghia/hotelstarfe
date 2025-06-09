import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../../config/formatPrice";
import { Button, Table } from "react-bootstrap";
import { getIdBooking } from "../../../config/idBooking";

const OverTime = ({ item }) => {

    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 10; // Số lượng bản ghi trên mỗi trang
    const totalPages = Math.ceil(item?.length / itemsPerPage); // Tổng số trang

    const formatDate = (dateString) => {
        return format(new Date(dateString), "dd-MM-yyyy HH:mm:ss");
    };

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
                            const encodedIdBookingRoom = btoa(booking.bookingRooms[0].id);
                            const priceDiscount = booking.discountPercent !== null? ( totalPrice * booking.discountPercent ) / 100 : 0;
                            return (
                                <tr key={index} className="tr-center">
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td>{getIdBooking(booking?.id,booking?.createAt)}</td>
                                    <td>Phòng {roomNames}</td>
                                    <td>
                                        <strong style={{ fontWeight: "500" }}>{booking.accountDto.fullname}</strong>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', }} >
                                            <i className="fa fa-pen" style={{ fontSize: '10px', marginRight: '6px', color: 'gray' }}></i>
                                            <span style={{ fontSize: '14px', color: 'gray', }} >
                                                {booking.descriptions || "Mô tả....."}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{formatDate(booking.startAt)}</td>
                                    <td>{formatDate(booking.endAt)}</td>
                                    <td>{formatCurrency(totalPrice - priceDiscount)}</td>
                                    <td style={{ color: booking.statusPayment ? "green" : "red" }}>
                                        {booking.statusPayment ? "Đã thanh toán" : "Chưa thanh toán"}
                                    </td>
                                    <td>
                                        <div className="d-flex">
                                            <Link to={`/employee/edit-room?idBookingRoom=${encodedIdBookingRoom}`}>
                                                <Button variant="outline-success">Trả phòng</Button>
                                            </Link>
                                            <div className="dropdown-center d-flex align-item-center">
                                                <button
                                                    style={{ backgroundColor: "transparent", border: "none" }}
                                                    className="btn dropdown-toggle"
                                                    type="button"
                                                    data-bs-toggle="dropdown">
                                                    <i className="fas fa-ellipsis-v"
                                                        style={{ color: "black", fontSize: "15px", marginTop: "auto" }}></i>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-light">
                                                    <li><a className="dropdown-item" href="#">Thêm sản phẩm, dịch vụ</a></li>
                                                    <li><a className="dropdown-item" href={`/employee/edit-room?idBookingRoom=${encodedIdBookingRoom}`}>Cập nhật đặt phòng</a></li>
                                                </ul>
                                            </div>
                                        </div>
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

export default OverTime;