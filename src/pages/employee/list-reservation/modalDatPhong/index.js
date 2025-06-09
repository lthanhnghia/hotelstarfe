import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { getAllRoom } from "../../../../services/employee/room";
import { formatCurrency } from "../../../../config/formatPrice";
import Alert from "../../../../config/alert";
import { format } from "date-fns";
import { addBookingOffline } from "../../../../services/employee/orderRoom";
import OrderRoom from "./list-order-room";

const DatPhong = ({ onClose, room }) => {
    const getDefaultDates = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return {
            checkInDate: today.toISOString().split("T")[0], // Định dạng yyyy-MM-dd
            checkOutDate: tomorrow.toISOString().split("T")[0],
        };
    };

    const { checkInDate: defaultCheckInDate, checkOutDate: defaultCheckOutDate } = getDefaultDates();
    const [checkInDate, setCheckInDate] = useState(defaultCheckInDate);
    const [checkOutDate, setCheckOutDate] = useState(defaultCheckOutDate);
    const [rooms, setRooms] = useState([]); // Danh sách phòng
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [guestLimit, setGuestLimit] = useState(1);
    const [alert, setAlert] = useState(null);
    const size = 2;

    // Mỗi khi checkInDate hoặc checkOutDate thay đổi, sẽ gọi lại handleRooms
    useEffect(() => {
        if (room) {
            const roomData = {
                roomId: room.id,
                roomName: room.roomName,
                typeRoomName: room.typeRoomDto.typeRoomName,
                bedName: room.typeRoomDto.typeBedDto.bedName,
                price: room.typeRoomDto.price,
                checkInDate,
                checkOutDate,
            };
            setSelectedRooms((prev) => {
                if (!prev.some((r) => r.roomId === room.id)) {
                    return [...prev, roomData];
                }
                return prev;
            });
        }
        setTimeout(() => setAlert(null), 500);
        handleRooms(currentPage);
    }, [checkInDate, checkOutDate, currentPage, guestLimit, totalPages,alert]);  // Theo dõi sự thay đổi của checkInDate và checkOutDate

    const handleRooms = async (page = 0) => {
        setCurrentPage(page); // Đặt lại currentPage khi tìm kiếm hoặc lọc mới
        const startDate = checkInDate || defaultCheckInDate;
        const endDate = checkOutDate || defaultCheckOutDate;

        const data = await getAllRoom(startDate, endDate, guestLimit, page, size);
        if (data) {
            setRooms(data.content);
            setTotalPages(data.totalPages);
        }
    };


    // Tìm kiếm và lọc phòng
    const filteredRooms = rooms.filter((room) =>
        room.roomName.toLowerCase().includes(searchTerm.toLowerCase())
        || room.typeRoomDto.typeRoomName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        handleRooms(0); // Reset về trang đầu tiên khi tìm kiếm
    };

    const handlePageChange = (direction) => {
        const newPage = currentPage + direction;
        if (newPage >= 0 && newPage < totalPages) {
            handleRooms(newPage); // Gọi lại danh sách phòng khi chuyển trang
        }
    };

    // Hàm chọn phòng
    const handleSelectRoom = (room) => {
        const roomData = {
            roomId: room.id,
            roomName: room.roomName,
            typeRoomName: room.typeRoomDto.typeRoomName,
            bedName: room.typeRoomDto.typeBedDto.bedName,
            price: room.typeRoomDto.price,
            checkInDate,
            checkOutDate,
        };
        // Thêm phòng vào danh sách nếu chưa có
        setSelectedRooms((prev) => {
            if (!prev.some((r) => r.roomId === room.id)) {
                return [...prev, roomData];
            }
            return prev;
        });
    };


    // Kiểm tra ngày chọn
    const handleCheckInDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();

        // Đặt giờ, phút, giây của currentDate về 0 để chỉ so sánh ngày
        currentDate.setHours(0, 0, 0, 0);

        // Kiểm tra ngày nhận phòng không được chọn là ngày quá khứ
        if (selectedDate < currentDate) {
            setAlert({ type: "error", title: "Ngày nhận phòng không được là ngày quá khứ!" });
            setTimeout(() => setAlert(null), 500)
            setCheckInDate("");
            return;
        }

        setCheckInDate(e.target.value);

        // Kiểm tra ngày trả phòng phải lớn hơn ngày nhận phòng ít nhất 1 ngày
        if (checkOutDate && new Date(checkOutDate) <= selectedDate) {
            setAlert({ type: "error", title: "Ngày trả phòng phải lớn hơn ngày nhận phòng ít nhất 1 ngày!" });
            setTimeout(() => setAlert(null), 500)
            setCheckOutDate("");
        }
    };

    const handleCheckOutDateChange = (e) => {
        const selectedDate = new Date(e.target.value);

        // Kiểm tra ngày trả phòng phải lớn hơn ngày nhận phòng ít nhất 1 ngày
        if (checkInDate && selectedDate <= new Date(checkInDate)) {
            setAlert({ type: "error", title: "Ngày trả phòng phải lớn hơn ngày nhận phòng ít nhất 1 ngày!" });
            setTimeout(() => setAlert(null), 500)
            setCheckOutDate("");
            return;
        }

        setCheckOutDate(e.target.value);
    };
    // Tính tổng giá
    const totalPrice = selectedRooms.reduce((total, room) => total + room.price, 0);

    const handleBooking = async () => {
        const idRoom = selectedRooms.map((e) => e.roomId);
        const orderData = {
            userName: "khachHang03",
            startDate: checkInDate,
            endDate: checkOutDate,
            roomId: idRoom
        }
        const response = await addBookingOffline(orderData);
        if (response) {
            setAlert({ type: response.status , title: response.message });
            setTimeout(() => onClose(), 3000);
        }
    };
    const handleRemoveRoom = (roomId) => {
        setSelectedRooms((prev) => prev.filter((room) => room.roomId !== roomId));
    };

    return (
        <Modal show={true} onHide={onClose} className="modal-noneBg modal-dialog-centered" centered>
            <Modal.Header closeButton>
                {alert && <Alert type={alert.type} title={alert.title} />}
                <Modal.Title className="fw-bolder">Chọn phòng</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ overflow: "auto" }}>
                <div className="row text-start mb-3">
                    <div className="col-12 col-md-5 mb-3">
                        <Form.Group controlId="checkInDate">
                            <Form.Label>Nhận phòng</Form.Label>
                            <Form.Control
                                type="date"
                                value={checkInDate}
                                onChange={handleCheckInDateChange}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-12 col-md-5 mb-3">
                        <Form.Group controlId="checkOutDate">
                            <Form.Label>Trả phòng</Form.Label>
                            <Form.Control
                                type="date"
                                value={checkOutDate}
                                onChange={handleCheckOutDateChange}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                        <Form.Group controlId="guestLimit">
                            <Form.Label>Số người</Form.Label>
                            <Form.Control
                                type="number"
                                value={guestLimit}
                                onChange={e => setGuestLimit(Number(e.target.value))}
                            />
                        </Form.Group>
                    </div>
                </div>
                <div className="product-search mt-3">
                    <div className="form-control-wrapper">
                        <div className="form-control autocomplete">
                            <input
                                type="text"
                                className="input-unstyled"
                                placeholder="Tìm theo tên phòng"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="form-control-prefix">
                            <i className="fa fa-search icon-mask" style={{ marginLeft: "10px" }}></i>
                        </div>
                    </div>
                </div>
                {/* Danh sách phòng */}
                <Table className="table-borderless table-responsive">
                    <thead>
                        <tr>
                            <th className="text-start">Lựa chọn khác</th>
                            <th className="text-center">Giá</th>
                            <th className="text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRooms.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <div>
                                        <strong>
                                            {item.roomName} - {item.typeRoomDto.typeRoomName} - {item.typeRoomDto.typeBedDto.bedName}
                                        </strong>
                                    </div>
                                    <div className="d-flex align-items-center mt-1">
                                        <i className="fa fa-user icon-mask icon-xs mr-2"></i> {item.typeRoomDto.guestLimit}
                                    </div>
                                </td>
                                <td className="text-right">{formatCurrency(item.typeRoomDto.price)}</td>
                                <td className="text-center">
                                    <Button
                                        variant="outline-success"
                                        onClick={() => handleSelectRoom(item)}
                                    >
                                        Chọn
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                        variant="outline-secondary"
                        onClick={() => handlePageChange(-1)}
                        disabled={currentPage === 0}
                    >
                        Trước
                    </Button>
                    <span>Trang {currentPage + 1} / {totalPages}</span>
                    <Button
                        variant="outline-secondary"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage + 1 === totalPages}
                    >
                        Tiếp theo
                    </Button>
                </div>
                <div className="mt-2">
                    {selectedRooms.length > 0 && (
                        <OrderRoom
                            selectedRooms={selectedRooms}
                            remove={(roomId) => handleRemoveRoom(roomId)} // Truyền hàm handleRemoveRoom vào
                        />
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer className="justify-content-between align-items-start flex-column">

                <div className="w-100 mt-3 d-flex justify-content-between align-items-center">
                    <div className="fw-bolder fs-5">Tổng giá: {formatCurrency(totalPrice)} VND</div>
                    <Button variant="success" className="ml-auto" onClick={handleBooking}>Đặt phòng</Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default DatPhong;
