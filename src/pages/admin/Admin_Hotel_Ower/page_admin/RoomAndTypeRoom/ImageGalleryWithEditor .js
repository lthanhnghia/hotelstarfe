import React, { useState, useRef } from 'react';
import { Button, Dropdown, Form, Card, Row, Col } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import './ImageSlider.css';

const ImageGalleryWithEditor = () => {
    const [text, setText] = useState('');
    const [images, setImages] = useState(Array(9).fill(null)); // Using Array(9).fill(null) for better readability
    const fileInputRef = useRef(null); // Tạo reference cho input file
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [selectedFormat, setSelectedFormat] = useState('Paragraph');

    const quillModules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            ['clean']
        ]
    };

    const quillFormats = [
        'header', 'font',
        'list', 'bullet',
        'bold', 'italic', 'underline',
        'link', 'image'
    ];

    const handleSelectFormat = (format) => {
        setSelectedFormat(format);
    };

    // Xử lý click vào ô thêm ảnh
    const handleAddImageClick = (index) => {
        setSelectedImageIndex(index);
        // Kích hoạt sự kiện click vào input file ẩn
        fileInputRef.current.click();
    };

    // Xử lý việc chọn ảnh
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newImages = [...images];
            newImages[selectedImageIndex] = URL.createObjectURL(file);
            setImages(newImages);
        }
    };

    return (
        <Card className="mt-4" style={{ border: 'none', boxShadow: 'none' }}>
            <Card.Body>
                <div className="slider">
                    <div className="image-container">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="image-box"
                                onClick={() => handleAddImageClick(index)}
                            >
                                {img ? <img src={img} alt={`Slide ${index + 1}`} /> : <span className="add-text">+ Thêm</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input file ẩn */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    ref={fileInputRef}
                    style={{ display: 'none' }} // Ẩn input file
                />

                {/* Khu vực chỉnh sửa văn bản */}
                <Card className="mt-3" style={{ border: 'none', boxShadow: 'none' }}>
                    <Card.Body>
                        <Row>
                            <Form>
                                <Form.Group controlId="formDescription">
                                    <Form.Label><h6>Mô tả</h6></Form.Label>
                                    <Dropdown className="d-inline mx-2">
                                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                                            {selectedFormat}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleSelectFormat('Heading 1')}>Heading 1</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleSelectFormat('Heading 2')}>Heading 2</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleSelectFormat('Paragraph')}>Paragraph</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <ReactQuill
                                        theme="snow"
                                        value={text}
                                        onChange={setText}
                                        modules={quillModules}
                                        formats={quillFormats}
                                    />
                                </Form.Group>
                            </Form>
                        </Row>
                    </Card.Body>
                </Card>

            </Card.Body>
        </Card>
    );
};

export default ImageGalleryWithEditor;
