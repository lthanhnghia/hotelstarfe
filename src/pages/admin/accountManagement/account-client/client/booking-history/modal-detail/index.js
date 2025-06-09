import React, { useState, useEffect } from "react";
import { Button, Card, Modal, Row, Col } from "react-bootstrap";
import Alert from "../../../../../../../config/alert";
import { formatCurrency } from "../../../../../../../config/formatPrice";
import { format } from "date-fns";
import { getBookingRoomInformation, getBookingRoomServiceRoom } from "../../../../../../../services/admin/account-manager";
import { Cookies } from "react-cookie";
import { getIdBooking } from "../../../../../../../config/idBooking";

const DetailHistoryOrder = ({ show, handleClose, item }) => {
    const [customer, setCustomer] = useState([]);
    const [serviceRoom, setServiceRoom] = useState([]);
    const [alert, setAlert] = useState(null);
    const cookie = new Cookies();
    const token = cookie.get("token");

    useEffect(() => {
        if (show && item?.bookingRooms) {
            const bookingRoomIds = item?.bookingRooms?.map(room => room.id);
            handleCustomerInformation(bookingRoomIds);
            handleServiceRoom(bookingRoomIds);
        }
    }, [show, item]);

    const formatDate = (dateString) => {
        return dateString ? format(new Date(dateString), "dd-MM-yyyy HH:mm") : "-";
    };

    const handleCustomerInformation = async (id) => {
        try {
            const data = await getBookingRoomInformation(id, token);
            setCustomer(data || []); // Fallback to empty array if no data
        } catch (error) {
            setAlert({ type: "error", title: "Tải dữ liệu thất bại" });
        }
    };
    const handleServiceRoom = async (id) => {
        try {
            const data = await getBookingRoomServiceRoom(id, token);
            setServiceRoom(data || []); // Fallback to empty array if no data
        } catch (error) {
            setAlert({ type: "error", title: "Tải dữ liệu thất bại" });
        }
    };

    if (!item) return null;

    return (
        <Modal show={show} onHide={handleClose} centered>
            {alert && <Alert type={alert.type} title={alert.title} />}
            <Modal.Header closeButton>
                <Modal.Title>Lịch sử đặt phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Card className="mb-3">
                    <Card.Header>
                        <strong>Phương thức thanh toán:</strong> {item?.methodPaymentDto?.methodPaymentName} <br />
                        <div className="d-flex justify-content-between">
                            <div>
                                <strong>Tổng số tiền:</strong> {item?.invoiceDtos?.[0]?.totalAmount ? formatCurrency(item.invoiceDtos[0].totalAmount) : 0}
                            </div>
                            <div>
                                <strong>Trạng thái thanh toán:</strong> {item.statusPayment ? "Đã thanh toán" : "Chưa thanh toán"}
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="mb-3">
                            <h6>Booking ID: {getIdBooking(item.id,item.createAt)}</h6>
                            <Row>
                                <Col><strong>Ngày tạo:</strong> {formatDate(item.createAt)}</Col>
                                <Col><strong>Ngày bắt đầu:</strong> {formatDate(item.startAt)}</Col>
                                <Col><strong>Trạng thái:</strong> {item?.invoiceDtos?.[0]?.invoiceStatus ? "Đã hoàn thành" : "Chưa hoàn thành"}</Col>
                            </Row>
                            <hr />
                            <h6>Chi tiết phòng</h6>
                            {item.bookingRooms.map((roomItem, index) => (
                                <Row key={index} className="mb-2">
                                    <Col><strong>Phòng:</strong> {roomItem.room?.roomName}</Col>
                                    <Col><strong>Check-in:</strong> {formatDate(roomItem.checkIn)}</Col>
                                    <Col><strong>Check-out:</strong> {formatDate(roomItem.checkOut)}</Col>
                                    <Col><strong>Giá:</strong> {formatCurrency(roomItem.price)}</Col>
                                </Row>
                            ))}
                            <hr />
                            <h6>Khách ở cùng</h6>
                            {customer.length > 0 ? customer.map((cust, index) => (
                                <Row key={index} className="mb-2">
                                    <Col><strong>Họ tên:</strong> {cust.customerInformationDto.fullname}</Col>
                                    <Col><strong>CMND:</strong> {cust.customerInformationDto.cccd}</Col>
                                    <Col><strong>SDT:</strong> {cust.customerInformationDto.phone}</Col>
                                    <Col><strong>Phòng:</strong> {cust.bookingRoomDto.room.roomName}</Col>
                                </Row>
                            )) : (
                                <p>Không có khách ở cùng.</p>
                            )}
                            <hr />
                            <h6>Dịch vụ</h6>
                            {serviceRoom.length > 0 ? serviceRoom.map((service, index) => (
                                <Row key={index} className="mb-2">
                                    <Col><strong>Tên dịch vụ:</strong> {service.serviceRoomDto.serviceRoomName}</Col>
                                    <Col><strong>Giá:</strong> {formatCurrency(service.serviceRoomDto.price)}</Col>
                                    <Col><strong>Phòng:</strong> {service.bookingRoomDto.room.roomName}</Col>
                                </Row>
                            )) : (
                                <p>Không có sử dụng thêm dịch vụ.</p>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Bỏ qua</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DetailHistoryOrder;
