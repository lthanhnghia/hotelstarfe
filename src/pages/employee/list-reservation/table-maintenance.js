import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import { getIdBooking } from "../../../config/idBooking";
import { bookingServiceRoom } from "../../../services/employee/service";
import { maintenanceScheduleSuccess } from "../../../services/employee/invoice";
import Alert from "../../../config/alert";
import AlertComfirm from "../../../config/alert/comfirm";

const Maintenance = ({ item }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsWithPrices, setBookingsWithPrices] = useState([]);
    const itemsPerPage = 10; // Số lượng bản ghi trên mỗi trang
    const totalPages = Math.ceil(item?.length / itemsPerPage); // Tổng số trang
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();


    const formatDate = (dateString) => {
        return format(new Date(dateString), "dd-MM-yyyy HH:mm:ss");
    };

    // Lấy dữ liệu của trang hiện tại
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return bookingsWithPrices?.slice(startIndex, endIndex) || [];
    };

    const getPriceService = async (idBookingRooms) => {
        try {
            const services = await bookingServiceRoom(idBookingRooms);
            // Calculate the total service price
            const totalPriceService = services.reduce((total, item) => {
                return total + (item.price || 0) * (item.quantity || 0);
            }, 0);

            return totalPriceService;
        } catch (error) {
            console.error("Error fetching service price:", error);
            return 0; // Return 0 if there's an error
        }
    };
    const prepareBookingsWithPrices = async () => {
        const updatedBookings = await Promise.all(
            item.map(async (booking) => {
                const roomPrice = booking.bookingRooms?.reduce(
                    (total, room) => total + (room.price || 0),
                    0
                );
                const idBookingRooms = booking.bookingRooms.map((room) => room.id);
                const servicePrice = await getPriceService(idBookingRooms);
                console.log(servicePrice);

                return {
                    ...booking,
                    totalPriceBooking: roomPrice + servicePrice,
                };
            })
        );
        setBookingsWithPrices(updatedBookings);
    };
    useEffect(() => {
        prepareBookingsWithPrices();
        setTimeout(() => setAlert(null), 500);
    }, [item]);

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

    const handleChange = async (booking) => {
        const data = {
            createAt: new Date().toISOString(),
            bookingId: booking.id
        }
        const confirmation = await AlertComfirm.confirm({
            type: "warning",
            title: "Xác nhận",
            text: "Hoàn tất bảo trì",
            confirmButtonText: "OK",
            cancelButtonText: "Hủy",
        });
        if (confirmation) {
            const res = await maintenanceScheduleSuccess(data);
            setAlert({ type: res.status, title: res.message });
            navigate(`/employee/list-booking-room`);
        }

    }
    return (
        <div>
            {alert && <Alert type={alert.type} title={alert.title} />}
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đặt phòng</th>
                        <th>Phòng</th>
                        <th>Nhân viên tạo lịch</th>
                        <th>Giờ bắt đầu</th>
                        <th>Giờ kết thúc</th>
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
                            return (
                                <tr key={index} className="tr-center">
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td>{getIdBooking(booking?.id, booking?.createAt)}</td>
                                    <td>Phòng {roomNames}</td>
                                    <td>{booking?.bookingRooms[0]?.accountDto?.fullname}</td>
                                    <td>{formatDate(booking.startAt)}</td>
                                    <td>{formatDate(booking.endAt)}</td>
                                    <td style={{ color: "red" }}>
                                        Bảo trì
                                    </td>
                                    <td>
                                        <Button variant="outline-success" onClick={() => handleChange(booking)}>Hoàn tất</Button>
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

export default Maintenance;