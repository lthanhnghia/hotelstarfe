import React, { useEffect, useState } from "react";
import { Modal, Button, Container, Row, Col, Card } from "react-bootstrap";
import "./style.css";
import { getImageHotel, saveImageHotel, deleteImageHotel, updateImageHotel } from "../../../../services/admin/home-info-service"; // Import hàm deleteImages
import Alert from "../../../../config/alert";
import { imageDb } from "../../../../config/configApi";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uploadImageToFirebase from "../../../../config/fireBase";

const ModalImage = ({ show, handleClose }) => {
    const [images, setImages] = useState([]); // Store image URLs
    const [alert, setAlert] = useState(null);
    const [listFile, setListFile] = useState([]);

    useEffect(() => {
        if (show) {
            handleImageHotelChange();
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
                    // Upload hình ảnh lên Firebase và lấy URL
                    const uploadedImageUrl = await uploadImageToFirebase(file);
    
                    // Tạo một đối tượng ImgageModel để gửi tới API
                    const imageModel = {
                        id: images[index].id, // Giữ nguyên id của hình ảnh để cập nhật
                        imageName: uploadedImageUrl, // Đường dẫn mới từ Firebase
                    };
    
                    // Gọi hàm updateImageHotel để gửi yêu cầu cập nhật tới API
                    await updateImageHotel([imageModel]);
                    setAlert({ type: "success", title: "Cập nhật ảnh thành công!" });
                } catch (error) {
                    setAlert({ type: "error", title: "Cập nhật ảnh thất bại: " + error.message });
                }
            }
        };
        input.click(); // Mở hộp thoại chọn file
    };
    
    const handleImageHotelChange = async () => {
        try {
            const data = await getImageHotel();
            if (data && Array.isArray(data)) {
                // Giả sử mỗi đối tượng hình ảnh có thuộc tính id và imageName
                const imageObjects = data.map(item => ({ id: item.id, imageName: item.imageName }));
                setImages(imageObjects);
            } else {
                throw new Error("Dữ liệu ảnh không hợp lệ.");
            }
        } catch (error) {
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
            const imgageModel = { id: imageToDelete.id };
    
            try {
                await deleteImageHotel([imgageModel]); // Gọi hàm xóa ảnh
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

            for (const file of listFile) {
                const url = await uploadImageToFirebase(file);
                uploadedUrls.push({ imageName: url });
            }

            console.log(uploadedUrls);
            await saveImageHotel(uploadedUrls);
            setAlert({ type: "success", title: "Tải ảnh và lưu đường dẫn thành công!" });
            handleClose(); // Đóng modal sau khi hoàn tất
        } catch (error) {
            setAlert({ type: "error", title: error.message });
        }
    };


    return (
        <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Thêm ảnh</Modal.Title>
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
        </Modal>
    );
};

export default ModalImage;
