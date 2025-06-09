import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { getAllRooms } from "../../../../services/employee/room";
import Alert from "../../../../config/alert";
import { postMaintenanceSchedule } from "../../../../services/employee/booking-manager";
import { Cookies } from 'react-cookie';
import { jwtDecode as jwt_decode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const MaintenanceModal = ({ handleClose }) => {
    const [receiveDate, setReceiveDate] = useState();
    const [returnDate, setReturnDate] = useState();
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [roomOptions, setRoomOptions] = useState([]);
    const [alert, setAlert] = useState(null);
    const cookies = new Cookies();
    const token = cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        handleGetRoom();
        setTimeout(() => setAlert(null), 500);
    }, [roomOptions, alert])

    const handleGetRoom = async () => {
        const data = await getAllRooms();
        const rooms = data.map(room => ({
            id: room.id,
            value: room?.roomName.replace("Phòng ", "P."),
            label: room?.roomName.replace("Phòng ", "P."),
        }));
        setRoomOptions(rooms);
    }
    const formatDateToISO = (dateString) => {
        const date = new Date(dateString); // Chuyển chuỗi thành đối tượng Date
        const year = date.getFullYear(); // Lấy năm
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (bắt đầu từ 0 nên cần +1) và thêm 0 nếu cần
        const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày và thêm 0 nếu cần
        return `${year}-${month}-${day}`; // Trả về chuỗi định dạng "YYYY-MM-DD"
    };
    const handleCreateSchedule = async () => {
        if (receiveDate == null || returnDate == null || selectedRooms.length < 0) {
            setAlert({ type: "error", title: "Vui lòng chọn đầy đủ thông tin" });
            return;
        }
        const selectedRoomIds = selectedRooms.map(room => room.id);
        const decodedToken = token ? jwt_decode(token) : null;
        const orderData = {
            userName: decodedToken.username,
            startDate: String(receiveDate),
            endDate: String(returnDate),
            roomId: selectedRoomIds
        }
    
        const convertedOrderData = {
            ...orderData,
            startDate: formatDateToISO(orderData.startDate),
            endDate: formatDateToISO(orderData.endDate),
        };
        const data = await postMaintenanceSchedule(convertedOrderData, decodedToken.username);
        setAlert({ type: data.status, title: data.message });
        if (data?.status === "success") {
            navigate(`/employee/home`);
            handleClose();
        }
    };

    return (
        <Modal show={true} onHide={handleClose} centered>
            <Modal.Header closeButton>
                {alert && <Alert type={alert.type} title={alert.title} />}
                <Modal.Title>Tạo Lịch Bảo Trì</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="table-responsive">
                    <table className="table table-borderless">
                        <thead>
                            <tr className="bg-light">
                                <th>Phòng</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="align-middle">
                                <td>
                                    <Select
                                        options={roomOptions}
                                        isMulti
                                        placeholder="Chọn phòng..."
                                        value={selectedRooms}
                                        onChange={(selected) => setSelectedRooms(selected)}
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        }}
                                    />
                                </td>
                                <td>
                                    <DatePicker
                                        selected={receiveDate}
                                        onChange={(date) => setReceiveDate(date)}
                                        dateFormat="dd-MM-yyyy"
                                        className="form-control"
                                    />
                                </td>
                                <td>
                                    <DatePicker
                                        selected={returnDate}
                                        onChange={(date) => setReturnDate(date)}
                                        dateFormat="dd-MM-yyyy"
                                        className="form-control"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Bỏ qua
                </Button>
                <Button variant="success" onClick={handleCreateSchedule}>
                    Tạo lịch
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MaintenanceModal;
