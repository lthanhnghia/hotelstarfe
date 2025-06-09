import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form'; // Import useForm and Controller from React Hook Form
import './AddEmployeeModal.css';
import { addEmployee, updateAccountEmployee } from '../../../../../../services/admin/account-manager';
import uploadImageToFirebase from '../../../../../../config/fireBase';
import Alert from '../../../../../../config/alert';

const AddEmployeeModal = ({ show, handleClose, refreshData, selectedEmployee }) => {
    const { control, handleSubmit, setValue, formState: { errors }, setError, reset } = useForm(); // Use React Hook Form
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [alert, setAlert] = useState(null);

    // Cập nhật dữ liệu khi chuyển giữa thêm mới và chỉnh sửa
    useEffect(() => {
        if (selectedEmployee) {
            reset(selectedEmployee); // Reset form with selected employee data
            setSelectedImage(selectedEmployee.avatar || null);
        } else {
            reset(); // Reset form for new employee
        }
    }, [selectedEmployee, reset]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file); // Lưu file ảnh vào imageFile để upload khi nhấn Lưu
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result); // Chỉ hiển thị ảnh trên giao diện
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('imageInput').click();
    };

    const onSubmit = async (data) => {
        try {
            let avatarUrl = data.avatar;

            // Upload ảnh mới nếu có file ảnh
            if (imageFile) {
                avatarUrl = await uploadImageToFirebase(imageFile);
                if (!avatarUrl) {
                    setAlert({ type: 'error', title: 'Không thể tải ảnh lên. Vui lòng thử lại.' });
                    return;
                }
            }

            // Tạo payload chung
            const payload = { ...data, avatar: avatarUrl };
            let response;
            if (selectedEmployee) {
                response = await updateAccountEmployee(payload);
            } else {
                response = await addEmployee(payload);
            }

            // Xử lý kết quả từ API
            if (response && response.code === '200') {
                const action = selectedEmployee ? 'Cập nhật' : 'Thêm';
                setAlert({ type: 'success', title: `${action} nhân viên thành công!` });
                reset(); // Reset form after successful submit
                handleClose();
                refreshData();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (!show) {
            setAlert(null);
        }
    }, [show]);


    return (
        <Modal show={show} onHide={handleClose} centered>
            {alert && <Alert type={alert.type} title={alert.title} />}
            <Modal.Header closeButton>
                <Modal.Title>{selectedEmployee ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="employee-form">
                    <Col md={4} className="employee-image mt-4">
                        <div className="image-upload" onClick={triggerFileInput}>
                            {selectedImage ? (
                                <img src={selectedEmployee ? selectedEmployee.avatar : selectedImage} alt="Selected" className="selected-image" />
                            ) : (
                                <span className="camera-icon">📷</span>
                            )}
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="imageInput"
                            />
                        </div>
                        {errors.image && <span className="text-danger">{errors.image.message}</span>} {/* Display image error */}
                    </Col>
                    <Col md={8} className="employee-info">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group as={Row}>
                                <Col md={6} className="mb-3">
                                    <Form.Label>Mã nhân viên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedEmployee ? selectedEmployee.id : 'Mã tự động'}
                                        disabled
                                    />
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Label>Tên tài khoản</Form.Label>
                                    <Controller
                                        name="username"
                                        control={control}
                                        rules={{
                                            required: 'Tên người dùng không được bỏ trống',
                                            minLength: { value: 6, message: 'Tên người dùng phải có ít nhất 6 ký tự' },
                                            pattern: {
                                                value: /^[a-zA-Z0-9._]+$/,
                                                message: 'Tên người dùng chỉ chứa chữ cái, số, dấu gạch dưới và dấu chấm, không được bắt đầu bằng số',
                                            },
                                        }}
                                        render={({ field }) => <Form.Control {...field} isInvalid={!!errors.username} />}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.username && errors.username.message}
                                    </Form.Control.Feedback>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Label>Tên nhân viên</Form.Label>
                                    <Controller
                                        name="fullname"
                                        control={control}
                                        rules={{ required: 'Họ tên không được bỏ trống', minLength: { value: 6, message: 'Họ tên phải có ít nhất 6 ký tự' } }}
                                        render={({ field }) => <Form.Control {...field} isInvalid={!!errors.fullname} />}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.fullname && errors.fullname.message}
                                    </Form.Control.Feedback>
                                </Col>
                                {selectedEmployee ? (
                                    <Col md={6} className="mb-3">
                                    <Form.Label>Giới tính</Form.Label>
                                    <div>
                                        <Controller
                                            name="gender"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <Form.Check
                                                        inline
                                                        label="Nam"
                                                        type="radio"
                                                        {...field}
                                                        value={true}
                                                        checked={field.value === true}
                                                    />
                                                    <Form.Check
                                                        inline
                                                        label="Nữ"
                                                        type="radio"
                                                        {...field}
                                                        value={false}
                                                        checked={field.value === false}
                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </Col>) : (<Col md={6} className="mb-3">
                                    <Form.Label>Giới tính</Form.Label>
                                    <div>
                                        <Controller
                                            name="gender"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <Form.Check
                                                        inline
                                                        label="Nam"
                                                        type="radio"
                                                        {...field}

                                                    />
                                                    <Form.Check
                                                        inline
                                                        label="Nữ"
                                                        type="radio"
                                                        {...field}

                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </Col>)}
                                {selectedEmployee == null && (
                                    <Col md={6} className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Controller
                                            name="passwords"
                                            control={control}
                                            rules={{
                                                required: 'Mật khẩu không được bỏ trống',
                                                minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                                            }}
                                            render={({ field }) => <Form.Control {...field} type="password" isInvalid={!!errors.passwords} />}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.passwords && errors.passwords.message}
                                        </Form.Control.Feedback>
                                    </Col>
                                )}
                                <Col md={6} className="mb-3">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        rules={{ required: 'Không được bỏ trống số điện thoại' }}
                                        render={({ field }) => <Form.Control {...field} isInvalid={!!errors.phone} />}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone && errors.phone.message}
                                    </Form.Control.Feedback>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{ required: 'Không được bỏ trống số email' }}
                                        render={({ field }) => <Form.Control {...field} isInvalid={!!errors.email} />}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email && errors.email.message}
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Modal.Footer>
                                <Button variant="success" type="submit">
                                    {selectedEmployee ? 'Cập nhật' : 'Lưu'}
                                </Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Bỏ qua
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default AddEmployeeModal;
