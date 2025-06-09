import React, { useState } from 'react';
import { Modal, Button, Card, Row, Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Cookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import Alert from '../../../../../../config/alert';
import { request } from '../../../../../../config/configApi';
import { FaPaperPlane, FaSave } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';

const FeedbackModal = ({ idFeedback, fullName, email }) => {
    const [show, setShow] = useState(false);
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm(); // Khởi tạo useForm
    const cookie = new Cookies();
    const token = cookie.get("token");
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const handleShow = () => {
        setShow(true);
        setAlert(null);
    };
    const handleClose = () => {
        setShow(false);
        reset();
    };

    const onSubmit = async (data) => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        const time = now.toLocaleTimeString('vi-VN');

        const formattedDate = `${day}-${month}-${year}T${time}Z`;

        // Xử lý gửi dữ liệu ở đây
        const formData = {
            id: idFeedback,
            message: data.message,
            create_at: formattedDate
        };

        try {
            const response = await request({
                method: "POST",
                path: "/api/messages/add",
                data: formData,
                headers: {
                    'Content-Type': 'application/json',
                },
                token: token,
            });

            if (response && response.code === 201) {
                setAlert({ type: "success", title: "Phản hồi thành công!" });
                sendEmail(data.message);
                navigate('/admin/feedback');
                handleClose();
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const sendEmail = async (message) => {
        const formData = {
            fullname: fullName,
            email: email,
            message: message
        };
        try {
            const response = await request({
                method: "POST",
                path: "/api/messages/send-email-feedback",
                data: formData,
                headers: {
                    'Content-Type': 'application/json',
                },
                token: token,
            });
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    return (
        <>
            {alert && <Alert type={alert.type} title={alert.title} />}

            <small className="btn btn-success" style={{ fontSize: '13px', cursor: 'pointer' }} onClick={() => {
                handleShow();
            }}>
                Phản hồi
            </small>

            <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="modal-wides"
                style={{ background: 'rgba(0, 0, 0, 0.7)' }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5>Phản hồi đánh giá</h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col md={12}>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group as={Row} controlId="message" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Câu trả lời của bạn
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4} // Số hàng hiển thị của textarea
                                                    placeholder="Nhập câu trả lời của bạn..."
                                                    name="message"
                                                    className="mb-2"
                                                    {...register('message', { required: 'Câu trả lời không được trống!' })}
                                                    isInvalid={errors.message}
                                                />
                                                {errors.message && (
                                                    <span className="text-danger">{errors.message.message}</span>
                                                )}
                                            </Col>

                                        </Form.Group>

                                        <Button variant="success" type="submit" id='submit-feedback' className='d-none'>
                                            Gửi
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
                            <Button variant="success" onClick={() => {
                                document.getElementById('submit-feedback').click();
                            }}>
                                <FaPaperPlane size={14} />&nbsp;Gửi
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

const FeedbackDetails = ({ idFeedback }) => {
    const [show, setShow] = useState(false);
    const cookie = new Cookies();
    const token = cookie.get("token");
    const [feedbackDetails, setFeedbackDetails] = useState(null);

    const handleShow = () => {
        setShow(true);
    };
    const handleClose = () => {
        setShow(false);
    };

    const fetchFeedbacks = async (idFeedback) => {
        try {
            const response = await request({
                method: "GET",
                path: `/api/messages/find-by-id/${idFeedback}`,
                token: token,
            });
    
            if (response) {
                setFeedbackDetails({ ...response, create_at: response.create_at.substring(0,10) });
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };
    

    return (
        <>
            {alert && <Alert type={alert.type} title={alert.title} />}

            <small className="btn btn-primary" style={{ fontSize: '13px', cursor: 'pointer' }} onClick={() => {
                fetchFeedbacks(idFeedback);
                handleShow();
            }}>
                Xem chi tiết
            </small>

            <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="modal-wides"
                style={{ background: 'rgba(0, 0, 0, 0.7)' }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5>Chi tiết phản hồi</h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {feedbackDetails ? (
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <p><strong>Câu trả lời:</strong> {feedbackDetails.message}</p>
                                        <p><strong>Ngày tạo:</strong> {feedbackDetails.create_at}</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ) : (
                        <p>Đang tải...</p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        <ImCancelCircle size={14} />&nbsp;Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};


export { FeedbackModal, FeedbackDetails };
