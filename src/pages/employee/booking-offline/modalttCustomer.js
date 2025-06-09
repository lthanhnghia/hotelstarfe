import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import Alert from '../../../config/alert';

const TTCustomer = ({ onClose, item}) => {
    const { register, handleSubmit, control, setValue } = useForm();
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (item && item.id) {
            setValue("id", item.id);
            setValue("hovaten", item.fullname);
            setValue("gioitinh", item.gender ? "true" : "false");
            setValue("sodienthoai", item.phone);
            setValue("lydoluutru", item.email);
        }
        setTimeout(() => setAlert(null), 500);
    }, [item, setValue, alert]);


    return (
        <Modal
            show={true}
            className="modal-dialog-centered modal-customer modal-noneBg"
            onHide={onClose}
            keyboard={false}
            centered
        >
            <div className="modal-content modal-lg">
                <Modal.Header closeButton>
                    {alert && <Alert type={alert.type} title={alert.title} />}
                    <Modal.Title className="modal-title">Thông tin khách hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label htmlFor="hovaten">Mã khách hàng</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="id"
                                    placeholder="Mã khách hàng"
                                    {...register('id')}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label htmlFor="lydoluutru">Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="lydoluutru"
                                    placeholder="Nhập email"
                                    {...register('lydoluutru')}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label htmlFor="hovaten">Họ và tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="hovaten"
                                    placeholder="Nhập họ và tên"
                                    {...register('hovaten')}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Giới tính</Form.Label>
                                <div className="d-flex flex-column flex-md-row">
                                    <Form.Check
                                        type="radio"
                                        label="Nam"
                                        id="gioitinh"
                                        value="true"
                                        onChange={() => setValue("gioitinh", true)} // Cập nhật giá trị boolean
                                        {...register("gioitinh")}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Nữ"
                                        id="gioitinh"
                                        value="false"
                                        onChange={() => setValue("gioitinh", false)}
                                        {...register("gioitinh")}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label htmlFor="sodienthoai">Số điện thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="sodienthoai"
                                    placeholder="Nhập số điện thoại"
                                    {...register('sodienthoai')}
                                />
                            </Col>
                           
                        </Row>
                    </Form>
                </Modal.Body>
            </div>
        </Modal>
    );
};


export default TTCustomer;
