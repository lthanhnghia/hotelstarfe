import React, { useEffect, useState } from 'react';
import { Modal, Button, Image, ListGroup, Row, Col, Carousel, Card, Pagination } from 'react-bootstrap';
import './style.css'; // Import CSS file
import { FaStar, FaRegStar } from 'react-icons/fa'; // For star icons

const RoomDetailModal = ({ show, onClose, room, avgStart }) => {
  // Số lượng đánh giá hiển thị trên mỗi trang
  const reviewsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  // Helper function to render star ratings
  const renderStars = (stars) => {
    return [...Array(5)].map((_, i) => {
      const fullStars = Math.floor(stars);
      const isHalfStar = stars - fullStars >= 0.5 && i === fullStars;
      return i < fullStars ? (
        <FaStar key={i} className="text-warning" />
      ) : isHalfStar ? (
        <FaStar key={i} className="text-warning half-star" />
      ) : (
        <FaRegStar key={i} className="text-muted" />
      );
    });
  };

  // Tính toán chỉ số bắt đầu và kết thúc cho các đánh giá ở trang hiện tại
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = room.feedBack ? room.feedBack.slice(indexOfFirstReview, indexOfLastReview) : [];

  // Hàm xử lý khi thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Tổng số trang
  const totalPages = room.feedBack ? Math.ceil(room.feedBack.length / reviewsPerPage) : 1;

  useEffect(() => {
    console.log(room);
  }, [room]);

  return (
    <Modal show={show} onHide={onClose} centered className="room-detail-modal" size="lg">
      <Modal.Header closeButton>
        <Modal.Title className=''>
          <h2>
            Chi tiết {room.typeRoomName}
          </h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* Phần hình ảnh phòng */}
          <Col xs={12} md={6}>
            <Carousel>
              {room.imageList?.map((img, index) => (
                <Carousel.Item key={index}>
                  <Image
                    src={img}
                    alt={`Phòng ${room.typeRoomName} - Hình ảnh ${index + 1}`}
                    fluid
                    className="d-block w-100 room-carousel-image"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          {/* Phần thông tin chi tiết phòng */}
          <Col xs={12} md={6}>
            <div className="room-detail-info">
              <p><strong>Tên loại phòng:</strong> {room.typeRoomName}</p>
              <p><strong>Số khách tiêu chuẩn:</strong> {room.guestLimit} người</p>
              <p><strong>Giường:</strong> {room.bedName}</p>
              <p><strong>Số giường:</strong> {avgStart.bedCount} giường</p>
              <p><strong>Diện tích:</strong> {room.acreage} m²</p>

              <strong>Tiện nghi:</strong>
              <Row>
                <Col xs={6}>
                  <ListGroup variant="flush">
                    {room.amenitiesList?.slice(0, 2).map((amenity, index) => (
                      <ListGroup.Item key={index}>{amenity.amenitiesTypeRoomName}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
                <Col xs={6}>
                  <ListGroup variant="flush">
                    {room.amenitiesList?.slice(2).map((amenity, index) => (
                      <ListGroup.Item key={index}>{amenity.amenitiesTypeRoomName}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <div className="room-price-container">
          <span><strong>Giá phòng</strong></span>
          <span className="room-detail-price">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}/Ngày
          </span>
        </div>
        {/* Phần đánh giá */}
        <div className="room-feedback mt-4">
          <h5>Đánh giá của khách hàng</h5>
          <p>
            <strong>Đánh giá trung bình:</strong>{' '}
            {room.averageFeedBack ? room.averageFeedBack.toFixed(1) : 'N/A'}{' '}
            {renderStars(room.averageFeedBack || 0)}
          </p>

          {room.feedBack && room.feedBack.length > 0 ? (
            <div className="feedback-container">
              {/* Duyệt qua mỗi phản hồi */}
              {currentReviews.map((feedback, index) => (
                <div key={feedback.id || index} className="mb-3">
                  <Card className="feedback-card shadow-sm">
                    <Card.Body>
                      <div className="row align-items-center">
                        {/* Ảnh đại diện */}
                        <div className="col-auto">
                          <img
                            src={room.image && room.image.length > 0 ? room.image[index % room.image.length] : 'default-image.jpg'}
                            alt={`Ảnh của ${room.accountNames && room.accountNames[index] ? room.accountNames[index] : 'Khách hàng ẩn danh'}`}
                            className="rounded-circle"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />    
                        </div>

                        {/* Tên và ngày */}
                        <div className="col">
                          <Card.Title className="mb-1">
                            <strong>{room.accountNames && room.accountNames[index] ? room.accountNames[index] : 'Khách hàng ẩn danh'}</strong>  {/* Tên khách hàng */}
                          </Card.Title>
                          <Card.Text className="text-muted mb-0">
                            {feedback.createAt ? new Date(feedback.createAt).toLocaleDateString('vi-VN') : 'Ngày không xác định'}  {/* Kiểm tra ngày */}
                          </Card.Text>
                        </div>
                      </div>

                      {/* Nội dung phản hồi */}
                      <div className="mt-3">
                        <p className="mb-2">{feedback.content}</p>
                        <div>{renderStars(feedback.stars)}</div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">Chưa có đánh giá nào.</p>
          )}

          {/* Chỉ hiển thị phân trang nếu reviewsPerPage lớn hơn 1 */}
          {reviewsPerPage > 1 && room.feedBack && room.feedBack.length > reviewsPerPage && (
            <Pagination>
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RoomDetailModal;
