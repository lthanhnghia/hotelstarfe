import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Row, Col, Form } from 'react-bootstrap';
import { FaClipboardCheck, FaSave } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { useForm } from 'react-hook-form';
import { GiCancel } from "react-icons/gi";
import { createServicePackage, deleteServicePackage, updateServicePackage } from '../../../../../../../../services/admin/service-management';
import Alert from '../../../../../../../../config/alert';

const PackedServiceFormModal = ({ item, refreshData }) => {
    const [show, setShow] = useState(false);
    const { register, handleSubmit, setValue } = useForm(); // Khởi tạo useForm
    const [alert, setAlert] = useState(null);
    useEffect(() => {
        if (item) {
            setValue("id", item.id);
            setValue("servicePackageName", item.servicePackageName);
            setValue("price", item.price);
        }
    }, [item, setValue]);
    const handleShow = () => { if (!show) { setShow(true) } };
    const handleClose = () => {
        setShow(false);
        setAlert(null);
    }

    const onSubmit = async (data) => {
        const servicePackage = { ...data, id: item?.id };  // Truyền id nếu là cập nhật
        try {
            const res = item
                ? await updateServicePackage(servicePackage)  // Cập nhật
                : await createServicePackage(data);  // Thêm mới
            if (item) {
                refreshData();
            }

            if (res) {
                setAlert({ type: res.status, title: res.message });
                // Gọi refreshData để tải lại dữ liệu
            }
        } catch (error) {
            setAlert({ type: 'error', title: error.message });
        }
        
        // Đảm bảo rằng bạn cho thời gian để render thông báo trước khi đóng modal
        setTimeout(() => {
            handleClose(); // Đóng modal sau khi thông báo hiển thị
        }, 1000); // Thời gian trễ (1 giây) để thông báo có thể render
    };



    return (
        <>
            {(() => {
                if (!item) {
                    return (
                        <small style={{ fontSize: '13px', cursor: 'pointer' }} id="packed-service-form" onClick={handleShow}>
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
                        <h5>{!item ? 'Thêm' : 'Cập nhật'} Gói Dịch Vụ</h5>
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
                                                Mã dịch vụ khách sạn
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Mã gói dịch vụ tự động" disabled
                                                    name='id'
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="servicePackageName" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Tên gói dịch vụ
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    {...register('servicePackageName', { required: true })} // Đăng ký trường với react-hook-form
                                                    placeholder="Nhập tên gói dịch vụ..."
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
                                                    {...register('price', { required: true, min: 1 })} // Đăng ký trường với react-hook-form
                                                    min="1" step="1"
                                                    placeholder="Nhập giá dịch vụ khách sạn..."
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

const DeletePackedServiceModal = ({ item, refreshData }) => {
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = async () => {
        try {
            const res = await deleteServicePackage(item?.id);
            console.log(res);
            
                refreshData();
            if (res) {
                setAlert({ type: res.status, title: res.message });
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
                    <Modal.Title>Xóa gói dịch vụ </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa gói dịch vụ <strong>{item?.servicePackageName}</strong> này?
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

export { PackedServiceFormModal, DeletePackedServiceModal };