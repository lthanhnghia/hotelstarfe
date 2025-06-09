import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Alert from "../../../../config/alert";
import { getBookingId, updateStatusBooking } from "../../../../services/employee/booking-manager";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { Cookies } from 'react-cookie';
import { getIdBooking } from "../../../../config/idBooking";

const ConfirmBookingModal = ({ booking, onClose }) => {
    const [alert, setAlert] = useState(null);
    const [bookingRoom, setBookingRoom] = useState([]);
    const location = useLocation();
    const [dates, setDates] = useState({
        startAt: null,
        endAt: null,
    });
    const navigate = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('token');
    const decodedToken = token ? jwt_decode(token) : null;

    // Đặt mặc định `startAt` và `endAt` từ bookingRoom dòng đầu tiên
    useEffect(() => {
        if (booking) {
            setDates({
                startAt: booking.startAt ? new Date(booking.startAt) : null,
                endAt: booking.endAt ? new Date(booking.endAt) : null,
            });
        }
        handleBookingRoom();
        setTimeout(() => setAlert(null), 500);
    }, [booking, alert]);

    const handleBookingRoom = async () => {
        const data = await getBookingId(booking?.id);
        setBookingRoom(data.bookingRooms);
    }

    // Xử lý khi thay đổi ngày
    const handleChange = (field, value) => {
        const now = new Date();
        if (value < now) {
            setAlert({ type: "error", title: "Ngày không được nhỏ hơn hiện tại!" });
            return;
        }
        if (field === "endAt" && value < dates.startAt) {
            setAlert({ type: "error", title: "Ngày trả không được nhỏ hơn ngày nhận!" });
            return;
        }
        if (field === "startAt" && dates.endAt && value > dates.endAt) {
            setAlert({ type: "error", title: "Ngày nhận không được lớn hơn ngày trả!" });
            return;
        }

        setDates((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    // Xử lý khi bấm nút "Xác nhận"
    const handleUpdateBooking = async () => {
        const newBooking = {
            startDate: dates.startAt.toISOString(),
            endDate: dates.endAt.toISOString(),
            userName: decodedToken.username
        }
        try {
            const data = await updateStatusBooking(booking.id, 4, newBooking);
            setAlert({ type: data.status, title: data.message });
            onClose();
            navigate(`/employee/list-booking-room`);
        } catch (error) {
            setAlert({ type: "error", title: error.message });
        }

    };

    return (
        <>
            <Modal show={true} onHide={onClose} centered>
                <Modal.Header closeButton>
                    {alert && <Alert type={alert.type} title={alert.title} />}
                    <Modal.Title>Xác nhận đặt phòng - {getIdBooking(booking?.id, booking?.createAt)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p>
                            <i className="bi bi-person-circle"></i> {booking?.accountDto?.fullname} - {booking?.accountDto?.phone}
                        </p>
                    </div>
                    <Table>
                        <thead>
                            <tr style={{ backgroundColor: "#eaf4eb" }}>
                                <th style={{ width: "40%" }}>Loại phòng</th>
                                <th style={{ width: "20%" }}>Phòng</th>
                                <th style={{ width: "20%" }}>Nhận</th>
                                <th style={{ width: "20%" }}>Trả</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingRoom.map((data, index) => (
                                <tr key={data.id}>
                                    <td style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                                        {data.room?.typeRoomDto?.typeRoomName} - {data.room?.typeRoomDto?.typeBedDto.bedName}
                                    </td>
                                    <td>{data.room?.roomName}</td>
                                    {index === 0 && ( // Chỉ hiện ô nhập ngày cho dòng đầu tiên
                                        <>
                                            <td>
                                                <DatePicker
                                                    selected={dates.startAt}
                                                    className="custom-date-picker"
                                                    onChange={(date) => handleChange("startAt", date)}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    timeCaption="Time"
                                                    dateFormat="dd/MM/yyyy, HH:mm"
                                                />
                                            </td>
                                            <td>
                                                <DatePicker
                                                    selected={dates.endAt}
                                                    className="custom-date-picker"
                                                    onChange={(date) => handleChange("endAt", date)}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    timeCaption="Time"
                                                    dateFormat="dd/MM/yyyy, HH:mm"
                                                />
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <p className="mt-3 mx-3 text-danger">
                    {booking.statusBookingDto.id === 1 ? "Khách hàng chưa xác nhận qua email" : ""}
                        
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleUpdateBooking} disabled={booking.statusBookingDto.id === 1} >
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ConfirmBookingModal;
