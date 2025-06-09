import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import MyProfileAdmin from './Profile';

function ModelAdmin() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <p variant="primary" onClick={handleShow}>
                Cập nhật thông tin
            </p>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MyProfileAdmin />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModelAdmin;