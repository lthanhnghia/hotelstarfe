import React from 'react';
import { Modal, Button, Image, Row, Col, Carousel } from 'react-bootstrap';
import './detail.css'; // Import CSS file

const RoomDetail = ({ show, onClose, room }) => {
    const images = room?.imageNames || [];
    const amenitiesList = room?.amenities || [];
    const priceFormatted = room.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price) : "Chưa có giá";
    
    return (
        <Modal show={show} onHide={onClose} centered className="room-detail-modal" size="lg">
            <Modal.Header closeButton>
                <Modal.Title><h2>Chi tiết {room.typeRoomName}</h2></Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row>
                    {/* Hình ảnh phòng */}
                    <Col xs={12} md={6}>
                        <Carousel>
                            {images.length > 0 ? images.map((img, index) => (
                                <Carousel.Item key={index}>
                                    <Image src={img} alt={`Phòng ${room.typeRoomName} - Hình ảnh ${index + 1}`} fluid className="d-block w-100 room-carousel-image" />
                                </Carousel.Item>
                            )) : <div>No images available</div>}
                        </Carousel>
                    </Col>

                    {/* Thông tin phòng */}
                    <Col xs={12} md={6}>
                        <div className="room-detail-info">
                            <p><strong>Tên loại phòng:</strong> {room.typeRoomName}</p>
                            <p><strong>Số khách tiêu chuẩn:</strong> {room.guestLimit} người</p>
                            <p><strong>Giường:</strong> {room.bedName}</p>
                            <p><strong>Số giường:</strong> {room.bedCount} giường</p>
                            <p><strong>Diện tích:</strong> {room.acreage} m²</p>

                            <strong>Tiện nghi:</strong>
                            <div className="amenities-list">
                                {amenitiesList.map((item, index) => (
                                    <div className="amenities-item" key={index}>
                                        <span className="amenities-badge">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </Col>
                </Row>

                {/* Giá phòng */}
                <div className="d-flex flex-column align-items-start mt-3">
                    <span><strong>Giá phòng:</strong></span>
                    <span className="price-final mt-2">{priceFormatted}/ Ngày</span>
                </div>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer className="ms-auto">
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>

    );
}

export default RoomDetail;
