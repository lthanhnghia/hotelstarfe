import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Card, Row, Col, Form } from 'react-bootstrap';
import { FaClipboardCheck, FaSave } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { GiCancel } from 'react-icons/gi';
import { useForm } from 'react-hook-form';
import { Cookies } from "react-cookie";
import { request } from '../../../../../../../../config/configApi';
import { useNavigate } from 'react-router-dom';
import Alert from '../../../../../../../../config/alert';


const AmenitiesTypeRoomFormModal = ({ idAmenitiesTypeRoom, amenitiesTypeRoomName }) => {
  const [show, setShow] = useState(false);
  const cookie = new Cookies();
  const token = cookie.get("token");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleShow = () => {
    if (!show) {
      setShow(true);
      setAlert(null);
      setValue('amenitiesTypeRoomName', amenitiesTypeRoomName || '');
    }
  };

  const handleClose = () => {
    setShow(false);
    reset(); // Đảm bảo form được reset khi đóng
  };

  const onSubmit = async (data) => {
    const formData = {
      id: idAmenitiesTypeRoom || '',
      amenitiesTypeRoomName: data.amenitiesTypeRoomName,
    };

    setIsLoading(true);  // Bắt đầu quá trình tải

    try {
      if (idAmenitiesTypeRoom) {
        // Gửi yêu cầu PUT đến API
        const response = await request({
          method: "PUT",
          path: "/api/amenities-type-room/update",
          data: formData,
          headers: {
            'Content-Type': 'application/json',
          },
          token: token,
        });

        if (response && response.code === 200) {
          setAlert({ type: "success", title: "Cập nhật tiện nghi loại phòng thành công!" });
          console.log('cập nhật tiện nghi khách sạn thành công!')
          navigate('/admin/amenities');
          handleClose();
        }
      } else {
        // Gửi yêu cầu POST đến API
        const response = await request({
          method: "POST",
          path: "/api/amenities-type-room/add",
          data: formData,
          headers: {
            'Content-Type': 'application/json',
          },
          token: token,
        });

        if (response && response.code === 200) {
          setAlert({ type: "success", title: "Thêm tiện nghi loại phòng thành công!" });
          navigate('/admin/amenities');
          handleClose();
        }
      }
    } catch (error) {
      console.error("Error while adding type room: ", error);
    } finally {
      setIsLoading(false);  // Kết thúc quá trình tải
    }
  };

  return (
    <>
      {alert && <Alert type={alert.type} title={alert.title} />}
      {!idAmenitiesTypeRoom ? (
        <small
          style={{ fontSize: '13px', cursor: 'pointer' }}
          id="amenitie-type-room-form"
          onClick={handleShow}
        >
          Thêm
        </small>
      ) : (
        <small
          className="btn btn-success me-2"
          style={{ fontSize: '13px', cursor: 'pointer' }}
          onClick={handleShow}
        >
          <FaClipboardCheck />
          &nbsp;Cập nhật
        </small>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-wides"
        style={{ background: 'rgba(0, 0, 0, 0.7)' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>
              {idAmenitiesTypeRoom ? 'Cập nhật' : 'Thêm'} Tiện Nghi Loại Phòng
            </h5>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Card>
            <Card.Body>
              <Row>
                <Col md={12}>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group as={Row} controlId="idAmenitiesTypeRoom" className="mt-3">
                      <Form.Label column sm={4}>
                        Mã tiện nghi Khách sạn
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          placeholder="Mã tiện nghi khách sạn tự động"
                          value={idAmenitiesTypeRoom || ''}
                          disabled
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="amenitiesTypeRoomName" className="mt-3">
                      <Form.Label column sm={4}>
                        Tên tiện nghi loại phòng
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          className='mb-2'
                          placeholder="Nhập tên tiện nghi loại phòng..."
                          {...register('amenitiesTypeRoomName', {
                            required: 'Tên tiện nghi không được để trống',
                          })}
                        />
                        {errors.amenitiesTypeRoomName && (
                          <small className="text-danger">
                            {errors.amenitiesTypeRoomName.message}
                          </small>
                        )}
                      </Col>
                    </Form.Group>
                    <Button
                      variant="success"
                      type="submit"
                      className="mt-3 d-none"
                      id="btnsubmit"
                    >
                      <FaSave size={14} />
                      &nbsp;Lưu
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>

        <Modal.Footer>
          <Row className="mt-3 justify-content-end">
            <Col sm="auto">
              <Button
                variant="success"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const btnSubmit = document.getElementById('btnsubmit');
                  if (btnSubmit) btnSubmit.click(); // Kích hoạt submit form
                }}
              >
                <FaSave size={14} />
                &nbsp;Lưu
              </Button>
            </Col>
            <Col sm="auto">
              <Button variant="dark" onClick={handleClose}>
                <ImCancelCircle size={14} />
                &nbsp;Bỏ qua
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DeleteAmenitiesTypeRoomModal = ({ id }) => {
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setAlert(null);
  };

  const cookie = new Cookies();
  const token = cookie.get("token");

  const handleDelete = async () => {
      try {
          const response = await request({
              method: "DELETE",
              path: `/api/amenities-type-room/delete/${id}`,
              headers: {
                  'Content-Type': 'application/json',
              },
              token: token, // Thay thế bằng token nếu cần
          });
          // Kiểm tra mã phản hồi từ API
          if (response && response.code === 200) {
              setAlert({ type: "success", title: "Xóa tiện nghi loại phòng thành công!" });
              navigate('/admin/amenities');
          }

      } catch (error) {
          setAlert({ type: "error", title: "Lỗi kết nối đến server: " + error.message });
      }
  }
  return (
      <>
          {alert && <Alert type={alert.type} title={alert.title} />}
          <button className="btn btn-danger" onClick={handleShow} style={{ fontSize: '13px' }}>
              <GiCancel />&nbsp;Xóa
          </button>
          <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton style={{ border: 'none' }}>
                  <Modal.Title>Xóa tiện nghi loại phòng </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  Bạn có chắc chắn muốn xóa tiện nghi loại phòng <strong>{id}</strong> này?
              </Modal.Body>
              <Modal.Footer style={{ border: 'none' }}>
                  <Button variant="danger" onClick={handleDelete}>
                      Đồng ý
                  </Button>
                  <Button
                      variant="dark" onClick={handleClose}
                      style={{
                          background: '#898C8D',      // Custom background color
                          border: 'none'
                      }}
                  >
                      Bỏ qua
                  </Button>
              </Modal.Footer>
          </Modal>
      </>
  );
};

export { AmenitiesTypeRoomFormModal, DeleteAmenitiesTypeRoomModal }
