import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { cancelBooking } from "../../../../services/employee/booking-manager";
import { useNavigate } from "react-router-dom";
import Alert from "../../../../config/alert";

const CancelBookingModal = ({ handleClose, booking }) => {
    const [reason, setReason] = useState("Khác");
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const handleSubmit = async () => {
        if (booking.id) {
            const res = await cancelBooking(booking.id, reason);
            res ? setAlert({ type: res.status, title: res.message }) : setAlert({ type: res.status, title: res.message });
            navigate('/employee/list-booking-room');
        } else {
            setAlert({ type: "error", title: "Không có mã đặt phòng này" });
        }
    }
    return (
        <Modal show={true} onHide={handleClose} centered size="xs">
            <Modal.Header closeButton>
                {alert && <Alert type={alert.type} title={alert.title} />}
                <Modal.Title>Hủy đặt phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Bạn có chắc chắn muốn hủy bỏ đơn đặt phòng này của khách hàng?</p>
                <Form>
                    <Form.Group controlId="reasonSelect" className="mb-3">
                        <Form.Label>Lý do hủy:</Form.Label>
                        <Form.Select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        >
                            <option value="Khác">Khác</option>
                            <option value="Khách thay đổi kế hoạch">Khách thay đổi kế hoạch</option>
                            <option value="Không thể liên lạc">Không thể liên lạc</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="customReason">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Nhập lý do..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleSubmit}>
                    Đồng ý
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Bỏ qua
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CancelBookingModal;