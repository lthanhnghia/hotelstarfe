import { useEffect, useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";

const ImageUploader = ({ label, onImageChange, image, setImage }) => {
    const [images, setImages] = useState('');
    useEffect(() => {
        // Kiểm tra xem image có phải là đối tượng không
        const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

        if (isObject(image)) {
            setImages(URL.createObjectURL(image));
        } else {
            setImages(image);
        }
    })
    return (
        <div className="image-gallery mt-3">
            <Form.Label>{label}</Form.Label>

            <Card className="image-card">
                <>
                    {image ? (
                        <>
                            <Card.Img variant="top" src={images} />

                        </>
                    ) : (
                        <>
                            <label htmlFor={label} className="add-image-placeholder">
                                <span>+</span>
                                <p>Thêm ảnh</p>
                            </label>
                            <input
                                id={label}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={onImageChange}
                            />
                        </>
                    )}
                </>

            </Card >
            <div className="button-container d-flex justify-content-center">
                <Button variant="danger" style={{maxWidth: "80px"}} onClick={() => setImage(null)}>
                    Xóa
                </Button>
            </div>
        </div>
    );
};

export default ImageUploader;
