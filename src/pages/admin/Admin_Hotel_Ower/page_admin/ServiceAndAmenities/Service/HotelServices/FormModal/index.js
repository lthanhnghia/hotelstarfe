import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Row, Col, Form } from 'react-bootstrap';
import { FaClipboardCheck, FaSave } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { GiCancel } from "react-icons/gi";
import ImageListSlider from '../../../../RoomAndTypeRoom/Rom/ImagesList';
import { useForm } from 'react-hook-form';
import uploadImageToFirebase from '../../../../../../../../config/fireBase';
import { createServiceHotel, deleteServiceHotel, updateServiceHotel } from '../../../../../../../../services/admin/service-management';
import Alert from '../../../../../../../../config/alert';
import { useNavigate } from 'react-router-dom';
import { Cookies } from "react-cookie";

const HotelServiceFormModal = ({ item, refreshData }) => {
    const [show, setShow] = useState(false);
    const { register, handleSubmit, setValue } = useForm();
    const [images, setImages] = useState([]);
    const [serviceHotel, setServiceHotel] = useState(item || {});
    const [alert, setAlert] = useState(null);
    const cookie = new Cookies();
    const token = cookie.get("token");

    useEffect(() => {
        if (item) console.log(item.id);

    }, [item]);

    useEffect(() => {
        if (item) setServiceHotel(item);
    }, [item]);

    const handleImagesChange = (file) => {
        setImages(file[0]);
    };

    const handleShow = () => { if (!show) { setShow(true) } };
    const handleClose = () => {
        setShow(false);
        setAlert(null)
    }

    const onSubmit = async () => {
        if (images.length <= 0) {
            setAlert({ type: "error", title: "Ảnh không được để trống" });
            return;
        }
        try {
            const urlImage = images ? await uploadImageToFirebase(images) : serviceHotel.image;
            console.log(urlImage);
            
            const updatedServiceHotel = { ...serviceHotel, image: urlImage || "" };
            
            const response = item ? await updateServiceHotel(updatedServiceHotel, token) : await createServiceHotel(updatedServiceHotel, token);
            if (item) {
                refreshData();
            }
            if (response) setAlert({ type: "success", title: response.message });
        } catch (error) {
            setAlert({ type: "error", title: error.message })
        } finally {
            // Đảm bảo đóng modal chỉ sau khi thông báo hiển thị
            setTimeout(() => {
                handleClose();
            }, 1000);
        }
    };

    return (
        <>
            {(() => {
                if (!item) {
                    return (
                        <small style={{ fontSize: '13px', cursor: 'pointer' }} id="hotel-service-form" onClick={handleShow}>
                            Thêm
                        </small>
                    );
                } else {
                    return (
                        <small className="btn btn-success me-2" style={{ fontSize: '13px', cursor: 'pointer' }} onClick={handleShow}>
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
                        {alert && <Alert type={alert.type} title={alert.title} />}
                        <h5>{item ? 'Cập nhật' : 'Thêm'} Dịch Vụ Khách Sạn</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group as={Row} controlId="formRoomName" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Mã dịch vụ khách sạn
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Mã dịch vụ khách sạn tự động"
                                                    disabled
                                                    value={serviceHotel?.id || ''}
                                                    onChange={(e) => setServiceHotel({ ...serviceHotel, id: e.target.value })}
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="serviceHotelName" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Tên dịch vụ khách sạn
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên dịch vụ khách sạn..."
                                                    value={serviceHotel?.serviceHotelName || ''}
                                                    onChange={(e) => setServiceHotel({ ...serviceHotel, serviceHotelName: e.target.value })}
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="price" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Giá
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="number"
                                                    {...register('price', { required: true, min: 1 })}
                                                    min="1" step="1"
                                                    placeholder="Nhập giá dịch vụ khách sạn..."
                                                    value={serviceHotel?.price || ''}
                                                    onChange={(e) => setServiceHotel({ ...serviceHotel, price: e.target.value })}
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Row className='mt-3'>
                                            <ImageListSlider onImagesChange={handleImagesChange} maxImages={1} img={serviceHotel?.image} />
                                        </Row>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" type='button' onClick={handleSubmit(onSubmit)}>
                        <FaSave size={14} />&nbsp;Lưu
                    </Button>
                    <Button variant="dark" onClick={handleClose}>
                        <ImCancelCircle size={14} />&nbsp;Bỏ qua
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const DeleteHotelServiceModal = ({ item, onDeleteSuccess, refreshData }) => {
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState(null);
    const cookie = new Cookies();
    const token = cookie.get("token");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = async () => {
        try {
            const data = await deleteServiceHotel(item.id, token);
            if (item) {
                refreshData();
            }
            if (data && data.code === 200) {
                setAlert({ type: "success", title: data.message });

                // Gọi callback để cập nhật lại dữ liệu sau khi xóa
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
            }
        } catch (error) {
            setAlert({ type: "error", title: error.message });
        }
        setTimeout(() => {
            handleClose(); // Đóng modal sau khi thông báo hiển thị
        }, 1000);
    };

    const handleSubmit = () => {
        handleDelete();
        handleClose();
    }

    return (
        <>
            <button className="btn btn-danger" onClick={handleShow}>
                <GiCancel />&nbsp;Xóa
            </button>
            <Modal show={show} onHide={handleClose}>
                {alert && <Alert type={alert.type} title={alert.title} />}
                <Modal.Header closeButton style={{ border: 'none' }}>
                    <Modal.Title>Xóa dịch vụ khách sạn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa dịch vụ khách sạn <strong>{item?.serviceHotelName}</strong> này?
                </Modal.Body>
                <Modal.Footer style={{ border: 'none' }}>
                    <Button variant="danger" onClick={handleSubmit}>
                        Đồng ý
                    </Button>
                    <Button variant="dark" onClick={handleClose} style={{ background: '#898C8D', border: 'none' }}>
                        Bỏ qua
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};


export { HotelServiceFormModal, DeleteHotelServiceModal };
