import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";

const MyProfileAdmin = () => {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <h3 className="text-center">Thông tin cá nhân</h3>
            <Form className="row g-3">
                <div className="col-md-12">
                    <div className="text-center mb-3">
                        <img
                            src={preview || "https://via.placeholder.com/150"}
                            alt="Avatar"
                            className="rounded-circle"
                            style={{ width: "150px", height: "150px" }}
                        />
                    </div>
                    <Form.Group className="position-relative mb-3 text-center avata" controlId="formAvatar">
                        <div
                            style={{ cursor: "pointer", display: "inline-block" }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            Chọn hình ảnh
                        </div>
                        <input
                            type="file"
                            style={{ display: "none" }}
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </Form.Group>
                </div>
                <div className="col-md-12">
                    <label htmlFor="inputUsername" className="form-label">Tên tài khoản:</label>
                    <input type="text" className="form-control" id="inputUsername" placeholder="Nhập tên tài khoản" />
                </div>
                <div className="col-md-12">
                    <label htmlFor="inputFullname" className="form-label">Họ và tên:</label>
                    <input type="text" className="form-control" id="inputFullname" placeholder="Nhập họ và tên" />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputEmail" className="form-label">Email:</label>
                    <input type="email" className="form-control" id="inputEmail" placeholder="Nhập email" />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputPhone" className="form-label">Số điện thoại:</label>
                    <input type="text" className="form-control" id="inputPhone" placeholder="Nhập số điện thoại" />
                </div>
                <div className="col-md-12">
                    <label htmlFor="inputGender" className="form-label">Giới tính:</label><br />
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="true" />
                        <label className="form-check-label" htmlFor="inlineRadio1">Nam</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="false" />
                        <label className="form-check-label" htmlFor="inlineRadio2">Nữ</label>
                    </div>
                </div>
                <div className="col-12">
                    <button type="button" className="btn btn-primary">Cập nhật</button>
                </div>
            </Form>
        </div>
    );
};

export default MyProfileAdmin;
