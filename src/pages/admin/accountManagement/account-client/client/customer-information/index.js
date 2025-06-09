import React from "react";
import {
    CBadge,
    CButton,
} from "@coreui/react";
import { Col, Row, Form } from "react-bootstrap";
const CustomerInformation = ({ item, onToggleDeleteStatus }) => {
    return (
        <>
            <Row className="mt-3">
                <Col xs={12} md={4}>
                    <div className="border-bottom-invoice">
                        <p>Mã khách hàng: <strong>{item.id}</strong></p>
                    </div>
                    <div className="border-bottom-invoice">
                        <p>Họ tên: <strong>{item.fullname}</strong></p>
                    </div>
                    <div className="border-bottom-invoice">
                        <p>Tài khoản: <strong>{item.username}</strong></p>
                    </div>
                    <div className="border-bottom-invoice">
                        <p>Email: <strong>{item.email}</strong></p>
                    </div>
                    <div className="border-bottom-invoice">
                        <p>Số điện thoại: <strong>{item.phone}</strong></p>
                    </div>
                </Col>
                <Col xs={12} md={4}>
                    <div className="form-check form-switch d-flex align-items-center border-bottom-invoice ps-0 mb-3 mt-3">
                        <label className="form-check-label me-3">Trạng thái:</label>
                        <CBadge color="danger" className="me-5">Khóa</CBadge>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                            checked={item.isDelete}
                            onChange={onToggleDeleteStatus}
                        />
                        <CBadge color="success" className="ms-2">Hoạt động</CBadge>
                    </div>
                    <div className="border-bottom-invoice d-flex align-items-center" style={{ marginTop: "-19px" }}>
                        <p className="mb-0 me-2">Vai trò: <strong>Khách hàng</strong></p>
                    </div>
                    <div className="border-bottom-invoice">
                        <p>Giới tính: <strong>{item.gender ? "Nam" : "Nữ"}</strong></p>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default CustomerInformation;
