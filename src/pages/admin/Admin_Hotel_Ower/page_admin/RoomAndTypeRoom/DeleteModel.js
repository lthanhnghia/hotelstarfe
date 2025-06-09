import { Modal, Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import React, { useState } from "react";
import Alert from "../../../../../config/alert";
import { useNavigate } from 'react-router-dom';
import { request } from "../../../../../config/configApi";
import Cookies from 'js-cookie';

// First modal component
function DeleteModelTypeRoom({ idTypeRoom }) {
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const response = await request({
                method: "DELETE",
                path: `/api/type-room/delete/${idTypeRoom}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                token: Cookies.get('token'), // Thay thế bằng token nếu cần
            });
            // Kiểm tra mã phản hồi từ API
            if (response && response.code === 200) {
                setAlert({ type: "success", title: "Xóa loại phòng thành công!" });
                navigate('/admin/room');
            }

        } catch (error) {
            if (error.response) {
                const code = error.response.status;
                if (code === 404) {
                    setAlert({ type: "error", title: "Loại phòng không tồn tại." });
                } else if (code === 409) {
                    setAlert({ type: "error", title: "Không thể xóa loại phòng này vì đang được sử dụng." });
                } else {
                    setAlert({ type: "error", title: "Có lỗi xảy ra, vui lòng thử lại sau." });
                }
            } else {
                setAlert({ type: "error", title: "Lỗi kết nối đến server: " + error.message });
            }
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            {alert && <Alert type={alert.type} title={alert.title} />}
            <button className="btn btn-danger" onClick={handleShow}>
                <MdDelete />&nbsp;Xóa
            </button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton style={{ border: 'none' }}>
                    <Modal.Title>Xóa Loại phòng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa loại phòng này không?
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

// Second modal component
function DeleteModelRoom({ idRoom }) {
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false); // To track loading state
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = async () => {
        try {
            setLoading(true); // Start loading
            const response = await request({
                method: "DELETE",
                path: `/api/room/delete/${idRoom}`, // Make sure the API path is correct
                headers: {
                    'Content-Type': 'application/json',
                },
                token: Cookies.get('token'), // Use token if needed
            });

            if (response && response.code === '200') {
                setAlert({ type: "success", title: "Xóa phòng thành công!" });
                navigate('/admin/room'); // Redirect after deletion
            }

        } catch (error) {
            if (error.response) {
                const code = error.response.status;
                if (code === '404') {
                    setAlert({ type: "error", title: "Phòng không tồn tại." });
                } else if (code === '409') {
                    setAlert({ type: "error", title: "Không thể xóa phòng này vì đang được sử dụng." });
                } else {
                    setAlert({ type: "error", title: "Có lỗi xảy ra, vui lòng thử lại sau." });
                }
            } else {
                setAlert({ type: "error", title: "Lỗi kết nối đến server: " + error.message });
            }
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <>
            {alert && <Alert type={alert.type} title={alert.title} />}
            <button className="btn btn-danger" onClick={handleShow}>
                <GiCancel />&nbsp;Xóa
            </button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton style={{ border: 'none' }}>
                    <Modal.Title>Xóa phòng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa phòng <strong>{idRoom}</strong> này?
                </Modal.Body>
                <Modal.Footer style={{ border: 'none' }}>
                    <Button variant="danger" onClick={handleDelete} disabled={loading}>
                        {loading ? 'Đang xóa...' : 'Đồng ý'}
                    </Button>
                    <Button
                        variant="dark" onClick={handleClose}
                        style={{
                            background: '#898C8D', // Custom background color
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

export { DeleteModelRoom, DeleteModelTypeRoom };
