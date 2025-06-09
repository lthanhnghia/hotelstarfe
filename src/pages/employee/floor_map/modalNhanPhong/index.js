import React, { useEffect, useState } from "react";
import TTNhanPhong from "../../list-reservation/modalTTNP";
import { Modal, Button, Table } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Alert from "../../../../config/alert";
import { getBookingRoomInformation, updateStatusCheckInBooking } from "../../../../services/employee/booking-manager";
import { fontSize } from "@mui/system";

const NhanPhong = ({ bookingRooms, onClose }) => {
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [customerInformation, setCustomerInformation] = useState([]);
    const [alert, setAlert] = useState(null);
    const [checkBoxSelected, setCheckBoxSelected] = useState([]); // Lưu các ID phòng đã chọn
    const [dates, setDates] = useState([]); // Lưu ngày nhận/trả phòng
    const parsedBookingRoom = Array.isArray(bookingRooms) ? bookingRooms : JSON.stringify([bookingRooms]);;
    const parsedBookingRooms = Array.isArray(bookingRooms) ? bookingRooms : JSON.parse(parsedBookingRoom);
    const filteredBookingRoom = parsedBookingRooms.filter(item => item.checkIn === null);

    // Đóng/Mở modal
    const handleCloseModal1 = () => setShowModal1(false);
    const handleShowModal1 = () => {
        setShowModal1(true);
    };

    const handleCloseModal2 = () => setShowModal2(false);
    const handleShowModal2 = async () => {
        console.log(dates);

        if (checkBoxSelected.length === 0) {
            setAlert({ type: "error", title: "Vui lòng chọn phòng" });
            return;
        }
        const bookingCreateAt = filteredBookingRoom[0]?.booking.startAt
            ? new Date(filteredBookingRoom[0].booking.startAt)
            : null;
        if (!bookingCreateAt) {
            setAlert({ type: "error", title: "Không tìm thấy ngày tạo booking" });
            return;
        }

        if (new Date() < bookingCreateAt) {
            setAlert({ type: "error", title: "Chưa tới ngày nhận phòng" });
            return;
        }
        const roomId = checkBoxSelected.map((e) => e.roomId);
        const RoomIdsString = roomId.join(',');
        const hasInvalidRoomStatus = filteredBookingRoom?.some((d) => {
            const roomStatus = d.room.statusRoomDto?.id;
            if (Number(roomStatus) === 5) {
                setAlert({ type: "error", title: `${d.room.roomName} chưa dọn không thể nhận` });
                return true;
            }
            if (Number(roomStatus) === 3) {
                setAlert({ type: "error", title: `${d.room.roomName} đang bảo trì không thể nhận` });
                return true;
            }
            return false;
        });

        if (hasInvalidRoomStatus) {
            return;
        }


        const occupiedRoom = filteredBookingRoom?.some((d) => {
            const roomStatus = d.room.statusRoomDto?.id;
            return Number(roomStatus) === 2;
        });
        if (occupiedRoom) {
            setAlert({ type: "error", title: "Phòng này đang có người" });
            return;
        }
        const newBookings = dates
            .filter(d => roomId.includes(d.roomId))
            .map(d => ({
                id: d.bookingRoomId,
                roomId: d.roomId,
                checkIn: new Date(),
                checkOut: d.checkOut?.toISOString(),
            }));
        const bookingId = filteredBookingRoom[0]?.booking.id
        try {
            if (bookingId) {
                const data = await updateStatusCheckInBooking(bookingId, RoomIdsString, newBookings);
                if (data) {
                    setAlert({ type: data.status, title: data.message });
                    if (data.status === "success") {
                        setShowModal1(false);
                        setShowModal2(true);
                    }
                }
            }

        } catch (error) {
            setAlert({ type: "error", title: error.message });
        }
    };

    // Cập nhật dữ liệu ngày nhận và trả phòng khi nhận bookingRoom
    useEffect(() => {
        if (filteredBookingRoom.length > 0) {
            const initialDates = filteredBookingRoom.map(item => {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                return {
                    roomId: item.room.id,
                    bookingRoomId: item.id,
                    checkIn: new Date(item.booking.startAt),
                    checkOut: new Date(item.booking.endAt),
                };
            });

            // Chỉ cập nhật nếu `initialDates` khác `dates`
            if (JSON.stringify(initialDates) !== JSON.stringify(dates)) {
                setDates(initialDates);
            }
            handleCustomer();
        }
    }, [filteredBookingRoom, dates]);
    useEffect(() => {
        if (alert) {
            const timeout = setTimeout(() => setAlert(null), 500);
            return () => clearTimeout(timeout);
        }
    }, [alert]);



    const handleCheckBoxChange = (roomId, bookingRoomId, checked) => {
        if (checked) {
            // Thêm vào danh sách đã chọn
            setCheckBoxSelected((prevSelected) => [
                ...prevSelected,
                { roomId, bookingRoomId }
            ]);
        } else {
            // Loại bỏ khỏi danh sách đã chọn
            setCheckBoxSelected((prevSelected) =>
                prevSelected.filter((item) => item.roomId !== roomId || item.bookingRoomId !== bookingRoomId)
            );
        }
    };


    const handleSelectAllChange = (checked) => {
        if (checked) {
            const allSelections = filteredBookingRoom.map((item) => ({
                roomId: item.room.id,
                bookingRoomId: item.id
            }));
            setCheckBoxSelected(allSelections);
        } else {
            setCheckBoxSelected([]);
        }
    };


    // Kiểm tra trạng thái "Chọn tất cả"
    const isSelectAll = checkBoxSelected.length === filteredBookingRoom.length;

    // Xử lý thay đổi ngày
    const handleChange = (field, bookingRoomId, value) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time part to compare dates only

        // Reset time part of the value to compare dates only
        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);

        // Check if the selected date is in the past

        const room = dates.find(item => item.bookingRoomId === bookingRoomId);
        if (!room) return;

        if (field === "checkOut" && value < room.checkIn) {
            setAlert({ type: "error", title: "Ngày trả không được nhỏ hơn ngày nhận!" });
            return;
        }
        if (field === "checkIn" && value > now) {
            setAlert({ type: "error", title: "Ngày nhận phòng không được trong tương lai!" });
            return;
        }

        if (field === "checkIn" && value > room.checkOut) {
            setAlert({ type: "error", title: "Ngày nhận không được lớn hơn ngày trả!" });
            return;
        }

        // Cập nhật ngày trong danh sách
        const updatedDates = dates.map(item =>
            item.bookingRoomId === bookingRoomId
                ? { ...item, [field]: value }
                : item
        );

        setDates(updatedDates);
        setAlert(null); // Xóa thông báo lỗi nếu hợp lệ
    };

    const handleCustomer = async () => {
        const idBookingRoom = filteredBookingRoom.map((e) => e.id);
        const idBookingRoomString = idBookingRoom.join(",");
        const data = await getBookingRoomInformation(idBookingRoomString);
        setCustomerInformation(data);
    }

    return (
        <>
            {/* Nút mở modal */}
            <Button
                variant="outline-dark"
                onClick={handleShowModal1}
                disabled={bookingRooms[0]?.booking?.statusBookingDto?.id === 6 || bookingRooms[0]?.booking?.statusBookingDto?.id === 8 || new Date() < new Date(bookingRooms[0]?.booking?.startAt)}>
                Nhận phòng
            </Button>

            {/* Modal xác nhận đặt phòng */}
            <Modal show={showModal1} onHide={handleCloseModal1} backdrop="static" centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Nhận phòng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <i className="bi bi-person-circle"></i>
                        {filteredBookingRoom[0]?.booking?.descriptions === "Đặt trực tiếp"
                            ? `${customerInformation[0]?.customerInformationDto?.fullname || ''} - ${customerInformation[0]?.customerInformationDto?.phone || ''}`
                            : `${filteredBookingRoom[0]?.booking?.accountDto?.fullname || ''} - ${filteredBookingRoom[0]?.booking?.accountDto?.phone || ''}`
                        }
                    </p>
                    {alert && <Alert type={alert.type} title={alert.title} />}
                    {/* Bảng danh sách phòng */}
                    <Table>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={isSelectAll}
                                        onChange={(e) => handleSelectAllChange(e.target.checked)}
                                    />
                                </th>
                                <th>Loại phòng</th>
                                <th>Phòng</th>
                                <th>Tình trạng phòng</th>
                                <th>Giờ vào</th>
                                <th>Giờ ra</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookingRoom.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <input
                                            type="checkbox"
                                            checked={checkBoxSelected.some(
                                                (selected) =>
                                                    selected.roomId === item.room.id && selected.bookingRoomId === item.id
                                            )}
                                            onChange={(e) =>
                                                handleCheckBoxChange(item.room.id, item.id, e.target.checked)
                                            }
                                        />
                                    </td>
                                    <td style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                                        {item.room?.typeRoomDto?.typeRoomName} - {item.room?.typeRoomDto?.typeBedDto?.bedName}
                                    </td>
                                    <td style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                                        {item.room?.roomName}
                                    </td>
                                    <td style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                                        <sapn style={{ fontSize: "13px" }} className={item.room?.statusRoomDto?.id === 4 || item.room?.statusRoomDto?.id === 1 ? "text-bg-success badge text-nowrap" : "text-bg-danger badge text-nowrap"}>{item.room?.statusRoomDto?.statusRoomName}</sapn>
                                    </td>
                                    <td>
                                        <DatePicker
                                            selected={dates.find(d => d.bookingRoomId === item.id)?.checkIn}
                                            className="custom-date-picker"
                                            onChange={(date) => handleChange("checkIn", item.id, date)}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="dd/MM/yyyy, HH:mm"
                                        />
                                    </td>
                                    <td>
                                        <DatePicker
                                            selected={dates.find(d => d.bookingRoomId === item.id)?.checkOut}
                                            className="custom-date-picker"
                                            onChange={(date) => handleChange("checkOut", item.id, date)}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="dd/MM/yyyy, HH:mm"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleShowModal2}>
                        Nhận phòng
                    </Button>
                </Modal.Footer>
            </Modal>
            {showModal2 && <TTNhanPhong onHide={handleCloseModal2} bookingRoomIds={checkBoxSelected.map((e) => e.bookingRoomId)} />}
        </>
    );
};

export default NhanPhong;
