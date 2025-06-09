import React, { useState } from 'react';
import { Modal, Button, Card, Row, Col, Form } from 'react-bootstrap';
import { FaClipboardCheck, FaSave } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { GiCancel } from "react-icons/gi";
import { useForm } from 'react-hook-form';
import { Cookies } from "react-cookie";
import { request } from '../../../../../../../../config/configApi';
import { useNavigate } from 'react-router-dom';
import Alert from '../../../../../../../../config/alert';

const AmenitiesHotelFormModal = ({ idAmenitiesHotel }) => {
    const [show, setShow] = useState(false);
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm(); // Khởi tạo useForm
    const cookie = new Cookies();
    const token = cookie.get("token");
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleShow = () => {
        setShow(true);
        setAlert(null);
    };
    const handleClose = () => {
        setShow(false);
        reset();
    };

    const fetchAmenitiesHotel = async () => {
        const response = await request({
            method: "GET",
            path: `/api/amenitiesHotel/getById/${idAmenitiesHotel}`,
            headers: {
                'Content-Type': 'application/json',
            },
            token: token, // Thay thế bằng token nếu cần
        });

        if (response) {
            setValue('amenitiesHotelName', response.data?.amenitiesHotelName || '');
        }
    };

    const onSubmit = async (data) => {
        // Xử lý gửi dữ liệu ở đây
        const formData = {
            id: idAmenitiesHotel || '',
            amenitiesHotelName: data.amenitiesHotelName,
        };

        setIsLoading(true);  // Bắt đầu quá trình tải

        try {
            if (idAmenitiesHotel) {
                // Gửi yêu cầu PUT đến API
                const response = await request({
                    method: "PUT",
                    path: "/api/amenitiesHotel/update",
                    data: formData,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    token: token,
                });

                if (response && response.code === 200) {
                    setAlert({ type: "success", title: "Cập nhật tiện nghi khách sạn thành công!" });
                    console.log('cập nhật tiện nghi khách sạn thành công!')
                    navigate('/admin/amenities');
                    handleClose();
                }
            } else {
                // Gửi yêu cầu POST đến API
                const response = await request({
                    method: "POST",
                    path: "/api/amenitiesHotel/add",
                    data: formData,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    token: token,
                });

                if (response && response.code === 200) {
                    setAlert({ type: "success", title: "Thêm tiện nghi khách sạn thành công!" });
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
            {(() => {
                if (!idAmenitiesHotel) {
                    return (
                        <small
                            style={{ fontSize: '13px', cursor: 'pointer' }}
                            id="amenitie-hotel-form"
                            onClick={handleShow}
                        >
                            Thêm
                        </small>
                    );
                } else {
                    return (
                        <small className="btn btn-success me-2" style={{ fontSize: '13px', cursor: 'pointer' }} onClick={() => {
                            handleShow();
                            fetchAmenitiesHotel();
                        }}>
                            <FaClipboardCheck />&nbsp;Cập nhật
                        </small>
                    );
                }
            })()}

            <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="modal-wides"
                style={{ background: 'rgba(0, 0, 0, 0.7)' }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5>{idAmenitiesHotel ? 'Cập nhật' : 'Thêm'} Tiện Nghi Khách Sạn</h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col md={12}>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group as={Row} controlId="idAmenitiesHotel" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Mã tiện nghi Khách sạn
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Mã tiện nghi khách sạn tự động"
                                                    disabled
                                                    name="id"
                                                    value={idAmenitiesHotel || ''}
                                                    {...register('idAmenitiesHotel')}
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="amenitiesHotelName" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Tên tiện nghi khách sạn
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên tiện nghi khách sạn..."
                                                    name="amenitiesHotelName"
                                                    className='mb-2'
                                                    {...register('amenitiesHotelName', { required: 'Tên tiện nghi không được để trống' })}
                                                    isInvalid={errors.amenitiesHotelName}
                                                />
                                                {errors.amenitiesHotelName && (
                                                    <span className="text-danger">{errors.amenitiesHotelName.message}</span>
                                                )}
                                            </Col>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <Modal.Footer>
                    <Row className="mt-3 justify-content-end">
                        <Col sm="auto">
                            <Button variant="success" type="submit" onClick={handleSubmit(onSubmit)}>
                                <FaSave size={14} />&nbsp;Lưu
                            </Button>
                        </Col>
                        <Col sm="auto">
                            <Button variant="dark" onClick={handleClose}>
                                <ImCancelCircle size={14} />&nbsp;Bỏ qua
                            </Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const DeleteAmenitiesHotelModal = ({ id }) => {
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const cookie = new Cookies();
    const token = cookie.get("token");

    const handleDelete = async () => {
        try {
            const response = await request({
                method: "DELETE",
                path: `/api/amenitiesHotel/delete/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                token: token, // Thay thế bằng token nếu cần
            });
            // Kiểm tra mã phản hồi từ API
            if (response && response.code === 200) {
                setAlert({ type: "success", title: "Xóa tiện nghi khách sạn thành công!" });
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
                    <Modal.Title>Xóa tiện nghi khách sạn </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa tiện nghi khách sạn <strong>{id}</strong> này?
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
}

export { AmenitiesHotelFormModal, DeleteAmenitiesHotelModal };
