import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Card, Row, Col, Form } from 'react-bootstrap';
import { FaClipboardCheck, FaSave } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { GiCancel } from "react-icons/gi";
import ImageListSlider from '../../../../RoomAndTypeRoom/Rom/ImagesList';
import { useForm } from 'react-hook-form';
import { createRoomService, deleteRoomService, getAllTypeRoomService, updateRoomService } from '../../../../../../../../services/admin/service-management';
import uploadImageToFirebase from '../../../../../../../../config/fireBase';
import { Cookies } from "react-cookie";
import Alert from '../../../../../../../../config/alert';
import { useNavigate } from 'react-router-dom';

const RoomServiceFormModal = ({ item }) => {
    const [show, setShow] = useState(false);
    const { register, handleSubmit, setValue, reset } = useForm(); // Khởi tạo useForm
    const [images, setImages] = useState([]);
    const [typeRoomService, setTypeRoomService] = useState([]);
    const [alert, setAlert] = useState(null);
    const cookie = new Cookies();
    const token = cookie.get("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (item) {
            setValue("id", item.id);
            setValue("serviceRoomName", item.serviceRoomName);
            setValue("price", item.price);
            setValue("typeServiceRoom", item?.typeServiceRoomDto?.id);
        }
        handleTypeRoomService();
        setTimeout(() => setAlert(null), 500);
    }, [item, setValue]);


    const handleImagesChange = (newImages) => {
        setImages(newImages);
    };

    const handleTypeRoomService = async () => {
        try {
            const data = await getAllTypeRoomService();
            if (!data) {

            } else {
                setTypeRoomService(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleShow = () => {
        if (!show) {
            setShow(true);
        }
    }
    const handleClose = () => {
        setShow(false);
        // setAlert(null);
        reset();
    }

    const onSubmit = async (data) => {
        if (item == null && images.length <= 0) {
            setAlert({ type: "error", title: "Vui lòng chọn ảnh" });
            return;
        }

        const urlImage = images.length > 0 ? await uploadImageToFirebase(images[0]) : "";
        const service = { ...data, imageName: images.length > 0 ? urlImage : item.imageName };

        try {
            const serviceCall = item
                ? updateRoomService(service.id, service, token)
                : createRoomService(service, token);

            serviceCall
                .then(res => {

                    if (res && res.code === 200) {
                        setAlert({ type: 'success', title: item ? 'Cập nhật dịch vụ phòng thành công!' : 'Thêm dịch vụ phòng thành công!' });
                        handleClose();
                        navigate('/admin/service');
                    }
                })
                .catch(error => {
                    setAlert({ type: "error", title: error.message });
                });
        } catch (error) {
            setAlert({ type: "error", title: error.message });
        }
    };



    return (
        <>
         {alert && <Alert type={alert.type} title={alert.title} />}
            {(() => {
                if (!item) {
                    return (
                        <small style={{ fontSize: '13px', cursor: 'pointer' }} id="room-service-form" onClick={handleShow}>
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
                        <h5>{!item ? 'Thêm' : 'Cập nhật'} Dịch Vụ Phòng</h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col md={12}>
                                    <Form onSubmit={handleSubmit(onSubmit)}> {/* Thêm onSubmit vào form */}
                                        <Form.Group as={Row} controlId="formRoomName" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Mã dịch vụ phòng
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Mã dịch vụ phòng tự động" disabled
                                                    name='id'
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="serviceRoomName" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Tên dịch vụ phòng
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    {...register('serviceRoomName', { required: true })} // Đăng ký trường với react-hook-form
                                                    placeholder="Nhập tên dịch vụ phòng..."
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} controlId="id_typeServiceRoom" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Loại dịch vụ phòng
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Select
                                                    {...register('typeServiceRoom', { required: true })}
                                                    id="id_typeServiceRoom"
                                                    aria-label="Chọn loại dịch vụ phòng"
                                                >
                                                    <option value="">Chọn loại dịch vụ phòng...</option>
                                                    {typeRoomService.map((item, index) => {
                                                        return (
                                                            <option value={item?.id} key={index}>
                                                                {item?.serviceRoomName}
                                                            </option>
                                                        );
                                                    })}
                                                </Form.Select>
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} controlId="price" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Giá
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="number"
                                                    {...register('price', { required: true, min: 1 })} // Đăng ký trường với react-hook-form
                                                    min="1" step="1"
                                                    placeholder="Nhập giá dịch vụ phòng..."
                                                />
                                            </Col>
                                        </Form.Group>

                                        {/* <Form.Group as={Row} controlId="description" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Mô tả
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    as="textarea" // Đặt loại là textarea
                                                    rows={3} // Đặt số hàng cho textarea
                                                    {...register('description', { required: true })} // Đăng ký trường với react-hook-form
                                                    placeholder="Nhập mô tả..."
                                                />
                                            </Col>
                                        </Form.Group> */}

                                        <Row className='mt-3'>
                                            <ImageListSlider onImagesChange={handleImagesChange} maxImages={1} img={item?.imageName} />
                                        </Row>
                                        <Button variant="success" type="submit" className="mt-3 d-none" id='btnsubmit'>
                                            <FaSave size={14} />&nbsp;Lưu
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
                                type='button'
                                onClick={(e) => {
                                    e.preventDefault();
                                    const btnSubmit = document.getElementById('btnsubmit');
                                    if (btnSubmit) {
                                        btnSubmit.click();
                                    }
                                }}
                            >
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

const DeleteRoomServiceModal = ({ item, refreshData }) => {
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const cookie = new Cookies();
    const token = cookie.get("token");
    const handleDelete = async () => {
        try {
            const res = await deleteRoomService(item?.id, token);
            refreshData();
            if (res) {
                setAlert({ type: "warning", title: res.message });
                // Gọi refreshData để tải lại dữ liệu
            }
        } catch (error) {
            setAlert({ type: 'error', title: error.message });
        }

        // Đảm bảo rằng bạn cho thời gian để render thông báo trước khi đóng modal
        setTimeout(() => {
            handleClose();
        }, 1000);
    }

    return (
        <>
            <button className="btn btn-danger" onClick={handleShow}>
                <GiCancel />&nbsp;Xóa
            </button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton style={{ border: 'none' }}>
                    {alert && <Alert type={alert.type} title={alert.title} />}
                    <Modal.Title>Xóa dịch vụ phòng </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa dịch vụ phòng <strong>{item?.serviceRoomName}</strong> này?
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

export { RoomServiceFormModal, DeleteRoomServiceModal };
