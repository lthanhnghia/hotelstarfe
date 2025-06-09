import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { useForm, Controller } from 'react-hook-form';
import { addCustomer, updateCustomer } from '../../../../services/employee/customer';
import Alert from '../../../../config/alert';
import { getBookingRoomInformation } from '../../../../services/admin/account-manager';
import { useNavigate } from 'react-router-dom';

const InsertCustomer = ({ onClose, item, rooms, bookingRoom, fetchData, bookingoff, close }) => {
    const { register, handleSubmit, control, setValue } = useForm();
    const [customerInformation, setCustomerInformation] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (item && item.customerInformationDto?.birthday) {
            setValue("id", item.customerInformationDto.id);
            setValue("bookingRoomId", item.bookingRoomDto.id);
            setValue("ngaysinh", new Date(item.customerInformationDto.birthday));
            setValue("phong", item.bookingRoomDto.room.id + "");
            setValue("hovaten", item.customerInformationDto.fullname);
            setValue("gioitinh", item.customerInformationDto.gender ? "true" : "false");
            setValue("sodienthoai", item.customerInformationDto.phone);
            setValue("lydoluutru", item.customerInformationDto.cccd);
        }
        setTimeout(() => setAlert(null), 500);
    }, [item, setValue, alert]);

    useEffect(() => {
        const handleCustomerInfo = async () => {
            const idBookingRoom = bookingRoom.map((e) => e.id);
            const idBookingRoomString = idBookingRoom.join(",");
            const data = await getBookingRoomInformation(idBookingRoomString);
            setCustomerInformation(data);
        }
        handleCustomerInfo();
    }, [bookingRoom]);

    const validateForm = (data) => {
        const errors = {};
        if (!data.hovaten) errors.hovaten = "Họ và tên không được để trống.";
        if (!data.sodienthoai.match(/^(\+84|0)\d{9}$/)) errors.sodienthoai = "Số điện thoại không hợp lệ.";
        if (!data.ngaysinh) errors.ngaysinh = "Ngày sinh không được để trống.";
        return errors;
    };


    const onSubmit = async (data) => {
        // Validate dữ liệu đầu vào
        setIsLoading(true);
        if (!data.sodienthoai === 10) {
            setAlert({ type: "error", title: "Số điện thoại không đúng định dạng" });
            setIsLoading(false);
            return;
        }

        const errors = validateForm(data);
        if (Object.keys(errors).length > 0) {
            setAlert({ type: "error", title: "Vui lòng kiểm tra lại thông tin.", details: errors });
            setIsLoading(false);
            return;
        }
        const id = bookingRoom.filter(d => data.phong.includes(d.room.id)).map(d => ({ id: d.id }));
        if ((!id || id.length === 0) && !item) {
            setAlert({ type: "error", title: "Không tìm thấy phòng để thêm khách." });
            setIsLoading(false);
            return;
        }

        const checkGuestLimit = (roomId) => {
            const matchedCustomers = customerInformation.filter(
                (customer) => customer.bookingRoomDto.id === roomId
            );
            const guestLimit = bookingRoom.find((room) => room.id === roomId)?.room?.typeRoomDto?.guestLimit;
            return matchedCustomers.length < guestLimit;
        };

        if (!checkGuestLimit(id[0]?.id) && !item) {
            setAlert({ type: "error", title: "Phòng đã đầy không thể thêm" });
            setIsLoading(false);
            return;
        }
        const newCustomer = {
            cccd: data.lydoluutru,
            fullname: data.hovaten,
            phone: data.sodienthoai,
            gender: data.gioitinh === "true",
            birthday: data.ngaysinh.toISOString(),
        };
        try {
            const customerData = item ? await updateCustomer(item.id, newCustomer, id[0]?.id) : await addCustomer(newCustomer, id[0]?.id);
            setAlert({ type: customerData.status, title: customerData.message });
            if (bookingoff) {
                close();
                navigate("/employee/list-booking-room")
            } else {
                fetchData();
                onClose();
            }

        } catch (error) {
            setAlert({ type: "error", title: "Lỗi khi thêm khách hàng.", details: error.message });
        }
        setIsLoading(false);

    };



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
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label htmlFor="phong">Phòng</Form.Label>
                                <Form.Select id="phong" {...register('phong')}>
                                    {bookingRoom && bookingRoom.length > 0 ? (
                                        bookingRoom.map((item, index) => (
                                            <option key={index} value={item.room.id}>
                                                {item.room.roomName}
                                            </option>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Label htmlFor="ngaysinh" className='d-block'>Ngày sinh</Form.Label>
                                <Controller
                                    name="ngaysinh"
                                    control={control}
                                    defaultValue={null} // Giá trị mặc định ban đầu
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            selected={field.value} // Đồng bộ giá trị
                                            onChange={(date) => field.onChange(date)} // Cập nhật giá trị
                                            className="custom-date-picker"
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Chọn ngày sinh"
                                            style={{ width: "371px" }}
                                        />
                                    )}
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
                            <Col md={6}>
                                <Form.Label htmlFor="lydoluutru">Số CCCD</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="lydoluutru"
                                    placeholder="Nhập số căn cước"
                                    {...register('lydoluutru')}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="submit"
                        variant='outline-success'
                        onClick={handleSubmit(onSubmit)}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Đang lưu...
                            </>
                        ) : (
                            "Lưu"
                        )}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};


export default InsertCustomer;
