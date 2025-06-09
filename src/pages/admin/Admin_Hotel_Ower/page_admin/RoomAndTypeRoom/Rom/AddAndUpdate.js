import React, { useState, useRef, useEffect } from 'react';
import { Card, Col, Form, Row, Button, Spinner, Container } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { RiAddCircleLine } from "react-icons/ri";
import './modelCus.css';
import { FaSave, FaClipboardCheck } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import ImageListSlider from './ImagesList';
import { useForm } from 'react-hook-form';
import Alert from "../../../../../../config/alert";
import uploadImageToFirebase from "../../../../../../config/fireBase";
import { request } from '../../../../../../config/configApi';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import SelectRoomTypeAmenities from '../SelectOrUpdateRoomTypeAmenities';


function Add_Floor() {
    const [show, setShow] = useState(false);

    return (
        <>
            <small
                style={{ fontSize: '13px' }}
                onClick={(e) => {
                    e.stopPropagation();
                    setShow(true);
                }}
                id="add-area"
            >
                <RiAddCircleLine size={20} />
            </small>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                style={{ background: 'rgba(0, 0, 0, 0.7)' }}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        <h5>Thêm tầng</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card style={{ border: 'none', background: '#fff', boxShadow: 'none' }}>
                        <Card.Body>
                            <Form>
                                <Form.Group as={Row} controlId="formFloorName" className="mt-1">
                                    <Form.Label column sm={4}>
                                        Tầng
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formDescription" className="mt-1">
                                    <Form.Label column sm={4}>
                                        Ghi chú
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                        />
                                    </Col>
                                </Form.Group>
                            </Form>
                            <Row className="mt-5 justify-content-end">
                                <Col sm="auto">
                                    <Button
                                        variant="success"
                                        style={{
                                            fontSize: '1rem',           // Larger font size
                                            fontWeight: 'bold'          // Make the text bold
                                        }}
                                        onClick={() => setShow(true)}                                    >
                                        <FaSave size={14} />&nbsp;
                                        Đồng ý
                                    </Button>
                                </Col>
                                <Col sm="auto">
                                    <Button
                                        variant="dark"
                                        style={{
                                            background: '#898C8D',      // Custom background color
                                            fontSize: '1rem',           // Larger font size
                                            fontWeight: 'bold',
                                            border: 'none'         // Make the text bold
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShow(false)
                                        }}
                                    >
                                        <ImCancelCircle size={14} />&nbsp;
                                        Bỏ qua
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </>
    );
}

const Add_Update_TypeRoom = ({ idTypeRoom, amenities= [] }) => {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleClose = () => {
        setShow(false);
        reset();
    };
    const handleOpen = (e) => {
        e.stopPropagation();
        setShow(true);
        setAlert(null);
    };
    const [images, setImages] = useState([]);
    const [typeBeds, setTypeBeds] = useState([]);
    const [alert, setAlert] = useState(null);
    const [roomTypeAmenities, setRoomTypeAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const navigate = useNavigate();

    const handleImagesChange = (newImages) => {
        setImages(newImages);
    };

    //Chọn tiện nghi loại phòng
    const handleSelectionChange = (selectedOptions) => {
        setSelectedAmenities(selectedOptions);
        if (selectedOptions.length > 0) {
            setValue('amenities', 'true');
            clearErrors('amenities');
        } else {
            if (getValues('amenities') !== '') {
                setValue('amenities', '', { shouldValidate: true });
            }
        }
    };

    const { register, handleSubmit, setValue, clearErrors, getValues, formState: { errors }, reset } = useForm({
        defaultValues:
        {
            typeRoomBed: '',
            typeRoomName: '',
            typeRoomPrice: '',
            typeRoomNumberBed: '',
            acreage: '',
            guestLimit: 1,
        }
    });

    const fetchTypeRoom = async () => {
        const response = await request({
            method: "GET",
            path: `/api/type-room/find-by-id?id=${idTypeRoom}`,
            headers: {
                'Content-Type': 'application/json',
            },
            token: Cookies.get('token'), // Thay thế bằng token nếu cần
        });

        if (response) {
            setValue('typeRoomName', response?.typeRoomName || '');
            setValue('typeRoomPrice', response?.price || '');
            setValue('typeRoomBed', response?.typeBedDto.id || '');  // Chắc chắn rằng typeBedId có giá trị
            setValue('typeRoomNumberBed', response?.bedCount || '');
            setValue('acreage', response?.acreage || '');
            setValue('guestLimit', response?.guestLimit || 1);
            setValue('amenities', 'true');
        }
    };

    useEffect(() => {
        const fetchTypeBeds = async () => {
            const response = await request({
                method: "GET",
                path: "/api/overview/room-types/bed-type-options",
                token: Cookies.get('token'), // Thay thế bằng token nếu cần
            });

            if (response) {
                setTypeBeds(response);
            }
        };
        const fetchRoomTypesAmenities = async () => {
            const response = await request({
                method: "GET",
                path: "/api/amenities-type-room/getAll",
                token: Cookies.get('token'), // Thay thế bằng token nếu cần
            });

            if (response) {
                const options = response.map((amenity) => ({
                    value: amenity.id,
                    label: amenity.amenitiesTypeRoomName,
                }));
                setRoomTypeAmenities(options);
            }
        };
        fetchRoomTypesAmenities();
        fetchTypeBeds();
    }, []);

    const onSubmit = async (data) => {
        const amenitiesTypeRooms = selectedAmenities.map((amenity) => ({
            id: amenity.value,
            amenitiesTypeRoomName: amenity.label,
        }));

        const formData = {
            id: idTypeRoom,
            typeRoomName: data.typeRoomName,
            price: data.typeRoomPrice,
            typeBedId: data.typeRoomBed,
            bedCount: data.typeRoomNumberBed,
            acreage: data.acreage,
            guestLimit: data.guestLimit,
            amenitiesTypeRooms: amenitiesTypeRooms,
            describes: '',
            imageNames: []  // Gửi mảng các URL hình ảnh đã upload
        };

        setIsLoading(true);  // Bắt đầu quá trình tải

        try {
            if (idTypeRoom) {
                // Gửi yêu cầu PUT đến API
                const response = await request({
                    method: "PUT",
                    path: "/api/type-room/update",
                    data: formData,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    token: Cookies.get('token'),
                });

                if (response) {
                    setAlert({ type: "success", title: "Cập nhật loại phòng thành công!" });
                    navigate('/admin/room');
                    handleClose();
                }
            } else {
                const imageNames = [];

                // Lặp qua từng hình ảnh và upload chúng lên Firebase
                for (const image of images) {
                    const uploadedImageUrl = await uploadImageToFirebase(image); // Chờ URL được trả về
                    imageNames.push(uploadedImageUrl);  // Thêm URL vào mảng
                }

                formData.imageNames = imageNames;

                // Gửi yêu cầu POST đến API
                const response = await request({
                    method: "POST",
                    path: "/api/type-room/add",
                    data: formData,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    token: Cookies.get('token'),
                });

                if (response) {
                    setAlert({ type: "success", title: "Thêm loại phòng thành công!" });
                    setImages([]); // Xóa mảng images sau khi thêm loại phòng thành công
                    navigate('/admin/room');
                    handleClose();
                }
            }
        } catch (error) {
            console.error("Error while adding type room: ", error);
        } finally {
            setIsLoading(false);  // Kết thúc quá trình tải
        }
    };



    return (
        <>
            {alert && <Alert type={alert.type} title={alert.title} />}
            {(() => {
                if (!idTypeRoom) {
                    return (
                        <small
                            style={{ fontSize: '13px' }}
                            onClick={(e) => {
                                handleOpen(e);
                            }}
                            id='add-type-room'
                        >
                            Thêm loại phòng
                        </small>
                    );
                } else {
                    return (
                        <small className="btn btn-success me-2" style={{ fontSize: '13px', cursor: 'pointer' }} onClick={(e) => {
                            e.stopPropagation();
                            setShow(true);
                            fetchTypeRoom();
                            setAlert(null);
                        }} >
                            <FaClipboardCheck />&nbsp;Cập nhật
                        </small>
                    );
                }
            })()}
            <Modal
                show={show}
                onHide={handleClose}
                style={{ background: 'rgba(0, 0, 0, 0.7)' }}
                dialogClassName='modal-wides'
            >
                <div className="modal-content modal-fill" style={{ overflow: "auto" }}>
                    <Modal.Header closeButton>
                        <h5>{!idTypeRoom ? 'Thêm loại phòng mới' : 'Cập nhật loại phòng'}</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Card style={{ border: 'none', boxShadow: 'none' }}>
                                <Card.Body>
                                    <Row>
                                        <Col md={12} className="employee-info">
                                            <Form.Group as={Row} className="mb-3">
                                                <Col md={6}>
                                                    <Form.Label>Mã Loại phòng</Form.Label>
                                                    <Form.Control type="text" placeholder="Mã Loại tự động" value={idTypeRoom} disabled />
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Label>Tên loại phòng</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="typeRoomName"
                                                        {...register("typeRoomName", { required: 'Tên loại phòng là bắt buộc' })}
                                                        isInvalid={!!errors.typeRoomName}  // Thêm isInvalid
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.typeRoomName?.message}
                                                    </Form.Control.Feedback>
                                                </Col>

                                            </Form.Group>
                                            <Form.Group as={Row} className="mb-3">
                                                <Col md={6}>
                                                    <Form.Label>Giá</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="typeRoomPrice"
                                                        {...register("typeRoomPrice", {
                                                            required: 'Giá là bắt buộc',
                                                            min: { value: 1, message: 'Giá phải lớn hơn 0' }
                                                        })}
                                                        isInvalid={!!errors.typeRoomPrice}  // Thêm isInvalid
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.typeRoomPrice?.message}
                                                    </Form.Control.Feedback>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Label>Loại giường</Form.Label>
                                                    <Form.Select
                                                        name="typeRoomBed"
                                                        {...register("typeRoomBed", { required: 'Loại giường là bắt buộc' })}
                                                        isInvalid={!!errors.typeRoomBed}
                                                    >
                                                        <option value={''}>Chọn loại giường</option>
                                                        {typeBeds.map((bed) => (
                                                            <option key={bed.id} value={bed.id}>
                                                                {bed.bedName}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.typeRoomBed?.message}
                                                    </Form.Control.Feedback>
                                                </Col>

                                            </Form.Group>
                                            <Form.Group as={Row} className="mb-3">
                                                <Col md={6}>
                                                    <Form.Label>Số giường</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="typeRoomNumberBed"
                                                        {...register("typeRoomNumberBed", {
                                                            required: 'Số giường là bắt buộc',
                                                            min: { value: 1, message: 'Số giường phải lớn hơn 0' }
                                                        })}
                                                        isInvalid={!!errors.typeRoomNumberBed}  // Thêm isInvalid
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.typeRoomNumberBed?.message}
                                                    </Form.Control.Feedback>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Label>Diện tích</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="acreage"
                                                        {...register("acreage", {
                                                            required: 'Diện tích là bắt buộc',
                                                            min: { value: 1, message: 'Diện tích phải lớn hơn 0' }
                                                        })}
                                                        isInvalid={!!errors.acreage}  // Thêm isInvalid
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.acreage?.message}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="mb-3">
                                                <Col md={6}>
                                                    <Form.Label>Sức chứa tối đa</Form.Label>
                                                    <Form.Control type="number" defaultValue={1} min={1}
                                                        name="adultsMax"
                                                        {...register("guestLimit", {
                                                            required: 'Sức chứa là bắt buộc.',
                                                            min: { value: 1, message: 'Sức chứa phải lớn hơn 0' }
                                                        })}

                                                        isInvalid={!!errors.guestLimit}  // Thêm isInvalid
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.guestLimit?.message}
                                                    </Form.Control.Feedback>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Label>Chọn tiện nghi</Form.Label>
                                                    <SelectRoomTypeAmenities
                                                        onSelectionChange={handleSelectionChange}
                                                        options={roomTypeAmenities}
                                                        defaultSelectedOptions={amenities ? amenities : []}
                                                    />
                                                    <Form.Control
                                                        name="amenities"
                                                        {...register("amenities", { required: 'Vui lòng chọn ít nhất 1 tiện nghi!' })}
                                                        isInvalid={!!errors.amenities}
                                                        style={{ display: 'none' }}
                                                    >
                                                    </Form.Control>
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.amenities?.message}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            {!idTypeRoom && (
                                <ImageListSlider onImagesChange={handleImagesChange} maxImages={5} />
                            )}
                            <Modal.Footer>
                                <Row className="mt-3 justify-content-end">
                                    <Col sm="auto">
                                        <Button
                                            variant="success"
                                            style={{
                                                padding: '0.75rem 1.5rem',
                                                fontSize: '1rem',
                                                fontWeight: 'bold'
                                            }}
                                            type="submit" // Thêm type submit vào nút lưu
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Spinner
                                                        animation="border"
                                                        size="sm"
                                                        style={{ marginRight: '8px' }} // Khoảng cách giữa spinner và văn bản
                                                    />
                                                    Đang Lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave size={14} />&nbsp;
                                                    Lưu
                                                </>
                                            )}
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
                                            <ImCancelCircle size={14} />&nbsp;
                                            Bỏ qua
                                        </Button>
                                    </Col>
                                </Row>
                            </Modal.Footer>
                        </form>
                    </Modal.Body>
                </div>
            </Modal >
        </>
    );
};


const Update_Images_TypeRoom = ({ typeRoomImage, typeRoomName, idTypeRoom }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [images, setImages] = useState([]); // Store image URLs
    const [alert, setAlert] = useState(null);
    const [listFile, setListFile] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (show) {
            handleImageTypeRoomChange();
            setAlert(null); // Reset alert khi modal mở
        } else {
            resetModal(); // Reset modal khi đóng
        }
    }, [show]);

    const resetModal = () => {
        setImages([]); // Reset images nếu cần thiết
        setListFile([]); // Reset listFile nếu cần thiết
        setAlert(null); // Reset alert
    };

    const handleImageChange = (e) => {
        if (images.length >= 10) {
            return; // Chỉ có thể thêm tối đa 10 ảnh.
        }
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const newImage = { id: Date.now(), imageName: imageUrl }; // Tạo đối tượng mới với ID và URL
            setImages((prevImages) => [...prevImages, newImage]);
            setListFile((prevFiles) => [...prevFiles, file]);
            e.target.value = ""; // Reset file input for future uploads
        }
    };
    const handleEditImage = (index) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                // Tạo một URL tạm thời cho hình ảnh
                const imageUrl = URL.createObjectURL(file);

                // Cập nhật ảnh cục bộ
                setImages((prevImages) => {
                    const updatedImages = [...prevImages];
                    const updatedImage = { ...updatedImages[index], imageName: imageUrl }; // Cập nhật đường dẫn tạm thời
                    updatedImages[index] = updatedImage;
                    return updatedImages;
                });

                setListFile((prevFiles) => {
                    if (Array.isArray(prevFiles) && index - prevFiles.length >= 0 && index - prevFiles.length < prevFiles.length) {
                        // Nếu prevFiles là một mảng hợp lệ và index nằm trong khoảng
                        return prevFiles.map((file, i) => (i === index - prevFiles.length ? file : file)); // Cập nhật file mới cho index
                    } else {
                        // Nếu không, trả về mảng trước đó mà không thay đổi
                        return prevFiles;
                    }
                });


                try {
                    setLoading(true);
                    // Upload hình ảnh lên Firebase và lấy URL
                    const uploadedImageUrl = await uploadImageToFirebase(file);

                    // Tạo một đối tượng ImgageModel để gửi tới API
                    const imageModel = {
                        id: images[index].id, // Giữ nguyên id của hình ảnh để cập nhật
                        imageName: uploadedImageUrl, // Đường dẫn mới từ Firebase
                        typeRoom_Id: idTypeRoom
                    };
                    // Gọi hàm updateImageHotel để gửi yêu cầu cập nhật tới API
                    const response = await request({
                        method: "PUT",
                        path: "/api/image/putTypeImage",
                        data: imageModel,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        token: Cookies.get('token'),
                    });

                    if (response.code === '200') {
                        navigate('/admin/room');
                        setAlert({ type: "success", title: "Cập nhật ảnh thành công!" });
                    } else {
                        setAlert({ type: "error", title: "Cập nhật ảnh thất bại!" });
                    }
                    setLoading(false);
                } catch (error) {
                    setAlert({ type: "error", title: "Cập nhật ảnh thất bại: " + error.message });
                }
            }
        };
        input.click(); // Mở hộp thoại chọn file
    };

    const handleImageTypeRoomChange = async () => {
        try {
            const data = typeRoomImage;
            if (data) {
                const imageObjects = data.map(item => ({ id: item.id, imageName: item.imageName }));
                setImages(imageObjects);
            } else {
                throw new Error("Dữ liệu ảnh không hợp lệ.");
            }
        } catch (error) {
            console.error("Error:", error.message);  // Ghi log cho lỗi
            setAlert({ type: "error", title: error.message });
        }
    };

    const handleDeleteImage = async (index) => {
        const imageToDelete = images[index]; // Lấy đối tượng ảnh dựa vào index
        const updatedImages = images.filter((_, i) => i !== index); // Cập nhật lại danh sách images
        const updatedFiles = listFile.filter((_, i) => i !== index - index); // Cập nhật lại danh sách listFile

        setImages(updatedImages);
        setListFile(updatedFiles);

        // Kiểm tra xem ảnh đã lưu vào cơ sở dữ liệu (có id) hay chưa
        if (imageToDelete && imageToDelete.id) {
            const imageModel = { id: imageToDelete.id };
            const response = await request({
                method: "DELETE",
                path: "/api/image/delete-image",
                data: imageModel,
                headers: {
                    'Content-Type': 'application/json',
                },
                token: Cookies.get('token'),
            });
            if (response.code === '200') {
                navigate('/admin/room');
                setAlert({ type: "success", title: "Xóa ảnh thành công!" });
            } else {
                setAlert({ type: "error", title: "Xóa ảnh thất bại!" });
            }
            try {
                // Gọi hàm xóa ảnh
                setAlert({ type: "success", title: "Xóa ảnh thành công!" });
            } catch (error) {
                setAlert({ type: "error", title: "Xóa ảnh thất bại: " + error.message });
            }
        } else {
            // Nếu ảnh chưa lưu vào cơ sở dữ liệu, chỉ cần hiển thị thông báo thành công
            setAlert({ type: "success", title: "Xóa ảnh thành công!" });
        }
    };


    const handleSaveChanges = async () => {
        if (!listFile || listFile.length === 0) {
            handleClose(); // Đóng modal sau khi hoàn tất
            return;
        }

        try {
            const uploadedUrls = [];
            setLoading(true);
            for (const file of listFile) {
                const url = await uploadImageToFirebase(file);
                uploadedUrls.push({ imageName: url, typeRoom_Id: idTypeRoom });
            }
            const response = await request({
                method: "POST",
                path: "/api/image/postTypeImage",
                data: uploadedUrls,
                headers: {
                    'Content-Type': 'application/json',
                },
                token: Cookies.get('token'),
            });
            if (response[0].code === '200') {
                navigate('/admin/room');
                setAlert({ type: "success", title: "Tải ảnh và lưu đường dẫn thành công!" });
            } else {
                setAlert({ type: "error", title: "Tải ảnh và lưu đường dẫn thất bại!" });
            }
            setLoading(false);
            handleClose();
        } catch (error) {
            setAlert({ type: "error", title: error.message });
        }
    };



    return (
        <>
            <small className="btn btn-success me-2" style={{ fontSize: '13px', cursor: 'pointer' }} onClick={(e) => {
                e.stopPropagation();
                setShow(true);
            }}>
                <i class="fas fa-eye"></i> Ảnh
            </small>

            <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Hình ảnh loại phòng {typeRoomName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {alert && <Alert type={alert.type} title={alert.title} />}
                    <Container>
                        <div className="image-gallery mt-3">
                            <Row>
                                {images.map((image, index) => (
                                    <Col key={index} xs={6} sm={4} md={2} className="mb-3">
                                        <Card className="image-card">
                                            <Card.Img variant="top" src={image.imageName || "https://via.placeholder.com/100"} />
                                        </Card>
                                        <div className="button-container">
                                            <Button variant="warning" size="sm" onClick={() => handleEditImage(index)}>
                                                Sửa
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteImage(index)}>
                                                Xóa
                                            </Button>
                                        </div>
                                    </Col>
                                ))}
                                {images.length < 10 && (
                                    <Col xs={6} sm={4} md={2} className="mb-3">
                                        <Card className="add-image-card">
                                            <label htmlFor="image-upload" className="add-image-placeholder">
                                                <span>+</span>
                                                <p>Thêm ảnh</p>
                                            </label>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                onChange={handleImageChange}
                                            />
                                        </Card>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    {listFile.length > 0 && (
                        <Button variant="primary" onClick={handleSaveChanges}>
                            Lưu thay đổi
                        </Button>
                    )}

                </Modal.Footer>
                {loading && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 1000,
                    }}>
                        <ClipLoader color="#3498db" loading={loading} size={50} />
                    </div>
                )}
            </Modal>
        </>
    );
};

export { Add_Floor, Update_Images_TypeRoom, Add_Update_TypeRoom };