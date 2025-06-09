import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Row, Col, Form } from 'react-bootstrap';
import { FaClipboardCheck, FaSave } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { useForm } from 'react-hook-form';
import { GiCancel } from "react-icons/gi";
import { createTypeRoomService, deleteTypeRoomService, updateTypeRoomService } from '../../../../../../../../services/admin/service-management';
import { Cookies } from "react-cookie";
import Alert from '../../../../../../../../config/alert';
import { useNavigate } from 'react-router-dom';

const RoomServiceRoomFormModal = ({ item }) => {
    const [show, setShow] = useState(false);
    const { register, handleSubmit, setValue } = useForm();
    const [alert, setAlert] = useState(null);
    const cookie = new Cookies();
    const token = cookie.get("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (item) {
            setValue("id", item.id);
            setValue("serviceRoomName", item.serviceRoomName);
        }
    }, [item, setValue]);

    const handleShow = () => { if (!show) { setShow(true) } };
    const handleClose = () => {
        setShow(false);
    }

    const onSubmit = async (data) => {
        if (!token) {
            setAlert({ type: "error", title: "Bạn không có quyền hành động này" });
        }
        if (!data.serviceRoomName) {
            setAlert({ type: "error", title: "Không được bỏ trống thông tin" });
        }

        try {
            const res = item ? await updateTypeRoomService(item.id, data, token) : await createTypeRoomService(data, token);
            if (res) {
                setAlert({ type: "success", title: item ? "Cập nhật thành công" : "Thêm thành công" });
                handleClose();
                navigate('/admin/service');
            }
        } catch (error) {
            setAlert({ type: "error", title: error.message });
        } 
    };

    return (
        <>
            {(() => {
                if (!item) {
                    return (
                        <small style={{ fontSize: '13px', cursor: 'pointer' }} id="type-service-room-form" onClick={handleShow}>
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
                        <h5>{!item ? 'Thêm' : 'Cập nhật'} Loại Dịch Vụ phòng</h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col md={12}>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group as={Row} controlId="formRoomName" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Mã loại dịch vụ phòng
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Mã loại dịch vụ phòng tự động"
                                                    disabled
                                                    value={item?.id}
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="serviceRoomName" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Tên gói dịch vụ
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    {...register('serviceRoomName', { required: true })}
                                                    placeholder="Nhập tên loại dịch vụ phòng..."
                                                />
                                            </Col>
                                        </Form.Group>

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
                                    document.getElementById('btnsubmit').click();
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

const DeleteTypeServiceModal = ({ item, refreshData }) => {
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        setAlert(null);
    };
    const cookie = new Cookies();
    const token = cookie.get("token");
    const handleDelete = async () => {
            const res = await deleteTypeRoomService(item?.id, token);
            refreshData();
            console.log(res);
            if (res === 'Xóa thành công!') {
                setAlert({ type: "success", title: res });
                // Gọi refreshData để tải lại dữ liệu
            }
            if (res === 'Không thể xóa vì đang có dữ liệu liên quan!') {
                setAlert({ type: "error", title: res });
                // Gọi refreshData để tải lại dữ liệu
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
                    <Modal.Title>Xóa loại dịch vụ phòng </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa loại dịch vụ <strong>{item?.serviceRoomName}</strong> này?
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

export { RoomServiceRoomFormModal, DeleteTypeServiceModal };