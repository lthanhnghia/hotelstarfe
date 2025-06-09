import React, { useState, useEffect } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsPlus } from "react-icons/bs";
import './Style/Custom.css';
import { FaCalendarCheck, FaClipboardCheck, FaSave } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { AiOutlineDelete } from "react-icons/ai";
import { MdDelete, MdOutlineDeleteOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { request } from "../../../../../config/configApi";
import Cookies from 'js-cookie';
import { useForm } from "react-hook-form";
import Alert from "../../../../../config/alert";
import { useNavigate } from 'react-router-dom';

const RoomPriceModal = ({ id = null }) => {
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();

    const handleClose = () => {
        setShow(false);
        reset();

    };
    const handleShow = () => {
        setShow(true);
        setAlert(null);
    };

    const fetchDiscount = async () => {
        const response = await request({
            method: "GET",
            path: `/api/discount/get-by-id/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
            token: Cookies.get('token'), // Thay thế bằng token nếu cần
        });

        if (response) {
            setValue('discountName', response.discountName);
            setValue('percent', response.percent);
            setValue('startDate', response.startDate.split('T')[0]);
            setValue('endDate', response.endDate.split('T')[0]);
        }
    };

    const onSubmit = async (data) => {
        // Xử lý logic gửi dữ liệu
        const formData = {
            id: id,
            discountName: data.discountName,
            percent: data.percent,
            startDate: data.startDate + 'T00:00:00Z',
            endDate: data.endDate + 'T23:59:59Z',
        };

        if (id) {
            try {
                // Gửi yêu cầu POST đến API
                const response = await request({
                    method: "PUT",
                    path: "/api/discount/update-discount",
                    data: formData,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    token: Cookies.get('token'),
                });

                if (response && response.code === '200') {
                    setAlert({ type: "success", title: "Cập nhật giảm giá thành công!" });
                    navigate('/admin/discount');
                    handleClose();
                }

            } catch (error) {
                console.error("Error while adding discount: ", error);
                setAlert({ type: "error", title: "Có lỗi xảy ra khi cập nhật giảm giá!" });
            }
        } else {
            try {
                // Gửi yêu cầu POST đến API
                const response = await request({
                    method: "POST",
                    path: "/api/discount/post-discount",
                    data: formData,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    token: Cookies.get('token'),
                });

                if (response && response.code === '200') {
                    setAlert({ type: "success", title: "Thêm giảm giá thành công!" });
                    navigate('/admin/discount');
                    handleClose();
                }

            } catch (error) {
                console.error("Error while adding discount: ", error);
                setAlert({ type: "error", title: "Có lỗi xảy ra khi thêm giảm giá!" });
            }
        }
    };

    return (
        <>
            {alert && <Alert type={alert.type} title={alert.title} />}

            {(() => {
                if (!id) {
                    return (
                        <Button variant="success" className="d-flex align-items-center" onClick={handleShow}>
                            <BsPlus className="me-2" size={20} />
                            Thêm
                        </Button>
                    );
                } else {
                    return (
                        <small className="btn btn-success me-2" style={{ fontSize: '13px', cursor: 'pointer' }} onClick={() => {
                            handleShow();
                            fetchDiscount();
                        }} >
                            <FaClipboardCheck />&nbsp;Cập nhật
                        </small>
                    );
                }
            })()}

            <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="Custom-width-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{!id ? 'Thêm giảm giá' : 'Cập nhật giảm giá'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group as={Row}>
                                            <Form.Label column sm={4}>
                                                Mã giảm giá
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Mã giảm giá tự động"
                                                    value={id || ''}
                                                    disabled
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group as={Row}>
                                            <Form.Label column sm={4}><strong>Tên giảm giá</strong></Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên giảm giá..."
                                                    {...register("discountName", { required: "Tên giảm giá không được để trống" })}
                                                />
                                                {errors.discountName && (
                                                    <small className="text-danger">{errors.discountName.message}</small>
                                                )}
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                   
                                    <Col md={6} className="mb-3">
                                        <Form.Group as={Row}>
                                            <Form.Label column sm={4}>
                                                <strong>Ngày bắt đầu</strong>
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="date"
                                                    {...register("startDate", { required: "Vui lòng chọn ngày bắt đầu" })}
                                                />
                                                {errors.startDate && (
                                                    <small className="text-danger">{errors.startDate.message}</small>
                                                )}
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6} className="mb-3">
                                        <Form.Group as={Row}>
                                            <Form.Label column sm={4}>
                                                <strong>Ngày kết thúc</strong>
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="date"
                                                    {...register("endDate", { required: "Vui lòng chọn ngày kết thúc" })}
                                                />
                                                {errors.endDate && (
                                                    <small className="text-danger">{errors.endDate.message}</small>
                                                )}
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    
                                    <Col md={6} className="mb-3">
                                        <Form.Group as={Row}>
                                            <Form.Label column sm={4}><strong>Phần trăm</strong></Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Nhập phần trăm giảm..."
                                                    {...register("percent", {
                                                        required: "Phần trăm không được để trống",
                                                        min: { value: 1, message: "Phần trăm phải lớn hơn 0" },
                                                        max: { value: 100, message: "Phần trăm không được lớn hơn 100" }
                                                    })}
                                                />
                                                {errors.percent && (
                                                    <small className="text-danger">{errors.percent.message}</small>
                                                )}
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} className="mb-3">
                                        <small className="text-muted">
                                            <strong>* Lưu ý:</strong> Nếu giảm giá chỉ áp dụng trong 1 ngày,
                                            vui lòng chọn ngày bắt đầu và ngày kết thúc là giống nhau.
                                        </small>
                                    </Col>
                                </Row>
                                <Row className="mt-3 justify-content-end">
                                    <Col sm="auto">
                                        <Button
                                            type="submit"
                                            variant="success"
                                            style={{
                                                padding: '0.75rem 1.5rem',
                                                fontSize: '1rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            <FaSave size={14} />&nbsp; Lưu
                                        </Button>
                                    </Col>
                                    <Col sm="auto">
                                        <Button
                                            variant="dark"
                                            style={{
                                                background: '#898C8D',
                                                padding: '0.75rem 1.5rem',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                border: 'none'
                                            }}
                                            onClick={handleClose}
                                        >
                                            <ImCancelCircle size={14} />&nbsp; Bỏ qua
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </>
    );
};


const DeletePriceModal = ({ id }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const response = await request({
                method: "DELETE",
                path: `/api/discount/delete-discount/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                token: Cookies.get('token'), // Thay thế bằng token nếu cần
            });
            // Kiểm tra mã phản hồi từ API
            if (response && response.code === '200') {
                setAlert({ type: "success", title: "Xóa giảm giá thành công!" });
                navigate('/admin/discount');
            }

        } catch (error) {
            setAlert({ type: "error", title: "Có lỗi xảy ra, vui lòng thử lại sau." });
        }
    };

    return (
        <>
            {alert && <Alert type={alert.type} title={alert.title} />}

            <button className="btn btn-danger" onClick={handleOpen}>
                <MdDelete />&nbsp;Xóa
            </button>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Xóa giảm giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Bạn có chắc chắn muốn xóa giảm giá này không?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Row className="mt-3 justify-content-end">
                        <Col sm="auto">
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                            >
                                <FaCalendarCheck size={14} />&nbsp;
                                Đồng ý
                            </Button>
                        </Col>
                        <Col sm="auto">
                            <Button
                                variant="dark"
                                style={{
                                    background: '#898C8D',      // Custom background color
                                    border: 'none'         // Make the text bold
                                }}
                                onClick={handleClose}
                            >
                                <ImCancelCircle size={14} />&nbsp;
                                Bỏ qua
                            </Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export { RoomPriceModal, DeletePriceModal };
