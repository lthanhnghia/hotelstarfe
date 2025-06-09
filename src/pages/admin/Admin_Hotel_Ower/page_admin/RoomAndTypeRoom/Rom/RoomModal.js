import React, { useRef, useState, useEffect } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaClipboardCheck } from "react-icons/fa";
import { RiAddFill } from "react-icons/ri";
import { Add_Floor, Add_TypeRoom } from "./AddAndUpdate";
import './modelCus.css';
import { MdAdd } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { request } from "../../../../../../config/configApi";
import Alert from "../../../../../../config/alert";


const UpdateRoomModal = ({ idRoom }) => {
    const [show, setShow] = useState(false); // Bắt đầu với show là false
    const [floors, setFloors] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [statusRooms, setSatusRooms] = useState([]);
    const [statusRoom, setSatusRoom] = useState(null);
    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Sử dụng React Hook Form
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();


    // Hàm để mở modal
    const handleShow = () => {
        if (!show) { // Chỉ mở modal nếu nó đang đóng
            setShow(true);
        }
        setAlert(null);
    };

    // Hàm để đóng modal
    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        const fetchRoomTypes = async () => {
            const response = await request({
                method: "GET",
                path: "/api/type-room/getAll",
                token: Cookies.get('token'), // Thay thế bằng token nếu cần
            });

            if (response && response.length > 0) {

                setRoomTypes(response);
            }
        };
        const fetchFloors = async () => {
            const response = await request({
                method: "GET",
                path: "/api/floor/getAll",
                token: Cookies.get('token'), // Thay thế bằng token nếu cần
            });

            if (response && response.length > 0) {
                setFloors(response);
            }
        };
        const fetchStatusRooms = async () => {
            const response = await request({
                method: "GET",
                path: "/api/status-room/getAll",
                token: Cookies.get('token'), // Thay thế bằng token nếu cần
            });

            if (response && response.length > 0) {
                const filteredStatusRooms = response.filter(
                    (statusRoom) => {
                        const name = statusRoom.statusRoomName?.toLowerCase(); // Chuyển statusRoomName về chữ thường
                        return name === 'phòng trống' || name === 'bảo trì';
                    }
                );

                setSatusRooms(filteredStatusRooms);
            }

        };
        const fetchRoom = async () => {
            const response = await request({
                method: "GET",
                path: `/api/room/getById/${idRoom}`,
                token: Cookies.get('token'), // Thay thế bằng token nếu cần
            });

            if (response) {
                setValue('id', response.id);
                setValue('roomName', response.roomName);
                setValue('floor', response.floorDto.id);
                setValue('roomType', response.typeRoomDto.id);
                setValue('status', response.statusRoomDto.id);
                setSatusRoom(response.statusRoomDto.statusRoomName);
            }
        };
        fetchRoom();
        fetchStatusRooms();
        fetchFloors();
        fetchRoomTypes();
    }, []);

    // Lưu dữ liệu phòng
    const onSubmit = async (data) => {
        const formData = {
            id: data.id,
            roomName: data.roomName,
            floorId: data.floor,
            typeRoomId: data.roomType,
            statusRoomId: data.status,
        };
        setIsLoading(true);
        try {
            // Gửi yêu cầu POST đến API
            const response = await request({
                method: "PUT",
                path: "/api/room/put-room",
                data: formData,
                headers: {
                    'Content-Type': 'application/json',
                },
                token: Cookies.get('token'),
            });

            if (response) {
                setAlert({ type: "success", title: "Cập nhật phòng thành công!" });
                navigate('/admin/room');
                handleClose();
            }

        } catch (error) {
            console.error("Error while adding room: ", error);
        } finally {
            setIsLoading(false);  // Kết thúc quá trình tải
        }
    };



    return (
        <>
            {alert && <Alert type={alert.type} title={alert.title} />}
            <small style={{ fontSize: '13px', cursor: 'pointer' }} className="btn btn-success me-2" id="add-room" onClick={handleShow}>
                <FaClipboardCheck />&nbsp;Cập nhật
            </small>
            <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="modal-wides"
                style={{ background: 'rgba(0, 0, 0, 0.7)' }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5>Sửa thông tin phòng</h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Form.Group as={Row} controlId="idRoom" className="mt-3">
                                        <Form.Label column sm={4}>
                                            Mã phòng
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Mã phòng tự động"
                                                disabled
                                                {...register('id')}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="formRoomName" className="mt-3">
                                        <Form.Label column sm={4}>
                                            Tên phòng
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập tên phòng"
                                                {...register('roomName', { required: 'Tên phòng không được để trống' })}
                                            />
                                            {errors.roomName && <span className="text-danger">{errors.roomName.message}</span>}
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="formFloor" className="mt-3">
                                        <Form.Label column sm={4}>
                                            Tầng
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                as="select"
                                                {...register('floor', { required: 'Vui lòng chọn tầng' })}
                                            >
                                                <option value="">--Lựa chọn tầng--</option>
                                                {floors.map((floor) => (
                                                    <option key={floor.id} value={floor.id}>
                                                        {floor.floorName}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            {errors.floor && <span className="text-danger">{errors.floor.message}</span>}
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="formRoomType" className="mt-3">
                                        <Form.Label column sm={4}>
                                            Loại phòng
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                as="select"
                                                {...register('roomType', { required: 'Vui lòng chọn loại phòng' })}
                                            >
                                                <option value="">--Lựa chọn loại phòng--</option>
                                                {roomTypes.map((roomType) => (
                                                    <option key={roomType.id} value={roomType.id}>
                                                        {roomType.typeRoomName}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            {errors.roomType && <span className="text-danger">{errors.roomType.message}</span>}
                                        </Col>
                                    </Form.Group>


                                    {(statusRoom === 'phòng trống' || statusRoom === 'bảo trì') && (
                                        <Form.Group as={Row} controlId="formRoomStatus" className="mt-3">
                                            <Form.Label column sm={4}>
                                                Trạng thái
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control
                                                    as="select"
                                                    {...register('status', { required: 'Vui lòng chọn trạng thái' })}
                                                >
                                                    <option value="">--Lựa chọn trạng thái--</option>
                                                    {statusRooms.map((statusRoom) => (
                                                        <option key={statusRoom.id} value={statusRoom.id}>
                                                            {statusRoom.statusRoomName}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                {errors.status && <span className="text-danger">{errors.status.message}</span>}
                                            </Col>
                                        </Form.Group>
                                    )}
                                </Form>

                                {/* <Col md={6}>
                                    <Card style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                        <Card.Body>
                                            <Row>
                                                <Col md={12}>
                                                    <Card.Text>
                                                        Phòng áp dụng theo giá của loại phòng:
                                                    </Card.Text>
                                                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                                                        <li>
                                                            <span>• Giá giờ:</span> <strong>{prices.hourPrice}</strong>
                                                        </li>
                                                        <li>
                                                            <span>• Giá cả ngày:</span> <strong>{prices.dayPrice}</strong>
                                                        </li>
                                                        <li>
                                                            <span>• Phụ thu quá giờ:</span> <strong>{prices.overtimeFee}</strong>
                                                        </li>
                                                    </ul>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col> */}
                            </Row>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <Modal.Footer>
                    <Row className="mt-3 justify-content-end">
                        <Col sm="auto">
                            <Button
                                variant="success"
                                onClick={handleSubmit(onSubmit)}
                            >
                                <FaSave size={14} />&nbsp;
                                Lưu
                            </Button>
                        </Col>
                        <Col sm="auto">
                            <Button
                                variant="dark"
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

};


const AddRoomModal = () => {
    const [show, setShow] = useState(false);
    const [roomTypes, setRoomTypes] = useState([]);
    const [floors, setFloors] = useState([]);
    const [statusRooms, setSatusRooms] = useState([]);
    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Sử dụng React Hook Form
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Hàm mở modal
    const handleShow = () => {
        if (!show) {
            setShow(true);
        }
    };

    // Hàm đóng modal
    const handleClose = () => {
        setShow(false);
        reset(); // Reset form khi đóng modal
    };

    useEffect(() => {
        const fetchRoomTypes = async () => {
            const response = await request({
                method: "GET",
                path: "/api/type-room/getAll",
                token: Cookies.get('token'), // Thay thế bằng token nếu cần
            });

            if (response && response.length > 0) {
                setRoomTypes(response);
            }
        };
        const fetchFloors = async () => {
            const response = await request({
                method: "GET",
                path: "/api/floor/getAll",
                token: Cookies.get('token'), // Thay thế bằng token nếu cần
            });

            if (response && response.length > 0) {
                setFloors(response);
            }
        };
        const fetchStatusRooms = async () => {
            const response = await request({
                method: "GET",
                path: "/api/status-room/getAll",
                token: Cookies.get('token'), // Thay thế bằng token nếu cần
            });

            if (response && response.length > 0) {
                const filteredStatusRooms = response.filter(
                    (statusRoom) => {
                        const name = statusRoom.statusRoomName?.toLowerCase(); // Chuyển statusRoomName về chữ thường
                        return name === 'phòng trống' || name === 'bảo trì';
                    }
                );

                setSatusRooms(filteredStatusRooms);
            }

        };
        fetchStatusRooms();
        fetchFloors();
        fetchRoomTypes();
    }, []);

    // Lưu dữ liệu phòng
    const onSubmit = async (data) => {
        const formData = {
            roomName: data.roomName,
            floorId: data.floor,
            typeRoomId: data.roomType,
            statusRoomId: data.status,
        };
        setIsLoading(true);
        try {
            // Gửi yêu cầu POST đến API
            const response = await request({
                method: "POST",
                path: "/api/room/post-room",
                data: formData,
                headers: {
                    'Content-Type': 'application/json',
                },
                token: Cookies.get('token'),
            });

            if (response) {
                setAlert({ type: "success", title: "Thêm phòng thành công!" });
                navigate('/admin/room');
                handleClose();
            }

        } catch (error) {
            console.error("Error while adding room: ", error);
            setAlert({ type: "error", title: "Có lỗi xảy ra khi thêm phòng!" });
        } finally {
            setIsLoading(false);  // Kết thúc quá trình tải
        }
    };

    return (
        <>
            {alert && <Alert type={alert.type} title={alert.title} />}
            <small style={{ fontSize: '13px', cursor: 'pointer' }} id="add-room" onClick={handleShow}>
                Thêm phòng
            </small>
            <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="modal-wides"
                style={{ background: 'rgba(0, 0, 0, 0.7)' }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5>Thêm thông tin phòng mới</h5>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group as={Row} controlId="idRoom" className="mt-3">
                                    <Form.Label column sm={4}>
                                        Mã phòng
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Mã phòng tự động"
                                            disabled
                                            {...register('id')}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formRoomName" className="mt-3">
                                    <Form.Label column sm={4}>
                                        Tên phòng
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên phòng"
                                            {...register('roomName', { required: 'Tên phòng không được để trống' })}
                                        />
                                        {errors.roomName && <span className="text-danger">{errors.roomName.message}</span>}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formFloor" className="mt-3">
                                    <Form.Label column sm={4}>
                                        Tầng
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Select
                                            as="select"
                                            {...register('floor', { required: 'Vui lòng chọn tầng' })}
                                        >
                                            <option value="">--Lựa chọn tầng--</option>
                                            {floors.map((floor) => (
                                                <option key={floor.id} value={floor.id}>
                                                    {floor.floorName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {errors.floor && <span className="text-danger">{errors.floor.message}</span>}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formRoomType" className="mt-3">
                                    <Form.Label column sm={4}>
                                        Loại phòng
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Select
                                            as="select"
                                            {...register('roomType', { required: 'Vui lòng chọn loại phòng' })}
                                        >
                                            <option value="">--Lựa chọn loại phòng--</option>
                                            {roomTypes.map((roomType) => (
                                                <option key={roomType.id} value={roomType.id}>
                                                    {roomType.typeRoomName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {errors.roomType && <span className="text-danger">{errors.roomType.message}</span>}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formRoomStatus" className="mt-3">
                                    <Form.Label column sm={4}>
                                        Trạng thái
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Select
                                            as="select"
                                            {...register('status', { required: 'Vui lòng chọn trạng thái' })}
                                        >
                                            <option value="">--Lựa chọn trạng thái--</option>
                                            {statusRooms.map((statusRoom) => (
                                                <option key={statusRoom.id} value={statusRoom.id}>
                                                    {statusRoom.statusRoomName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {errors.status && <span className="text-danger">{errors.status.message}</span>}
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <Modal.Footer>
                    <Row className="mt-3 justify-content-end">
                        <Col sm="auto">
                            <Button
                                variant="success"
                                onClick={handleSubmit(onSubmit)}
                            >
                                <FaSave size={14} />&nbsp;
                                Lưu
                            </Button>
                        </Col>
                        <Col sm="auto">
                            <Button
                                variant="dark"
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
};

export { UpdateRoomModal, AddRoomModal };
