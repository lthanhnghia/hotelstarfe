import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DetailHistoryOrder from "./modal-detail";
import { getBookingAccount } from "../../../../../../services/admin/account-manager";
import { Cookies } from "react-cookie";
import { format } from "date-fns";
import { formatCurrency } from "../../../../../../config/formatPrice";
import Alert from "../../../../../../config/alert";
import { getIdBooking } from "../../../../../../config/idBooking";

const BookingHistory = ({ id }) => {
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [alert, setAlert] = useState(null);
    const cookie = new Cookies();
    const token = cookie.get("token");

    const handleShow = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    useEffect(() => {
        handleBookingHistory();
    }, []);

    const handleBookingHistory = async () => {
        try {
            const data = await getBookingAccount(id, token);
            if (data) {
                setBookings(data);
            }

        } catch (error) {
            setAlert({ type: 'error', title: error.message });
        }

    };

    const formatDate = (dateString) => {
        return format(new Date(dateString), "dd-MM-yyyy HH:mm");
    };

    return (
        <>
            <table className="table mt-3">
                {alert && <Alert type={alert.type} title={alert.title} />}
                <thead className="table-primary">
                    <tr>
                        <th scope="col">Mã đặt phòng</th>
                        <th scope="col">Phòng</th>
                        <th scope="col">Thời gian đặt</th>
                        <th scope="col">Lễ tân</th>
                        <th scope="col">Tổng tiền</th>
                        <th scope="col">Thanh toán</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length > 0 ? bookings.map((booking, index) => {
                        const roomNames = booking.bookingRooms
                            .map(room => room.room?.roomName.replace("phòng ", ""))
                            .join(", ");

                        return (
                            <tr key={index}>
                                <th scope="row">{getIdBooking(booking.id,booking.createAt)}</th>
                                <td>{roomNames}</td>
                                <td>{formatDate(booking.createAt)}</td>
                                <td>{booking.accountDto?.fullname || "N/A"}</td>
                                <td>{booking?.invoiceDtos[0]?.totalAmount ? formatCurrency(booking?.invoiceDtos[0]?.totalAmount) : 0}</td>
                                <td>{booking.statusPayment ? "Đã thanh toán" : "Chưa thanh toán"}</td>
                                <td>
                                    <Button variant="success" onClick={() => handleShow(booking)}>Chi tiết</Button>
                                </td>
                            </tr>
                        );
                    }) : (
                        <tr>
                            <td colSpan="7" className="text-center">Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <DetailHistoryOrder show={showModal} handleClose={handleClose} item={selectedItem} />
        </>
    );
};

export default BookingHistory;
