import React, { useState } from "react";
import { Accordion, Card, Col, Form, InputGroup, Row, Toast } from "react-bootstrap";
import { BsFilterLeft } from "react-icons/bs";
import "../style/FormStyles.css";
import { TableInfo } from "../components/Table";
const InvoiceContainer = () => {
    // Use useState to track open/close state
    const [isOpenAndClose, setIsOpenAndClose] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [timeRange, setTimeRange] = useState("");
    const [selectedRadio, setSelectedRadio] = useState("selectOption");
    const [selectedTimeOption, setSelectedTimeOption] = useState("");

    // Function to toggle the state
    const toggleActiveState = () => {
        setIsOpenAndClose((prevState) => !prevState);
    };

    const DatePicker = ({ label, id, value, onChange }) => {
        return (
            <Form.Group className="mb-3" controlId={id}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    type="date"
                    value={value}
                    onChange={onChange}
                    style={{ fontSize: '12px' }}
                />
            </Form.Group>
        );
    };


    const handleSaveDateRange = () => {
        if (startDate && endDate) {
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);
            setTimeRange(`${formattedStartDate} - ${formattedEndDate}`);
            setShowToast(false);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Thêm '0' nếu ngày có 1 chữ số
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng và thêm '0' nếu cần
        const year = date.getFullYear(); // Lấy năm của ngày đã chọn
        const currentYear = new Date().getFullYear(); // Năm hiện tại

        // Nếu năm khác năm hiện tại, hiển thị cả năm; nếu không, chỉ hiển thị ngày/tháng
        return year !== currentYear ? `${day}/${month}/${year}` : `${day}/${month}`;
    };

    const handleRadioChange = (radio) => {
        setSelectedRadio(radio);  // Cập nhật radio được chọn
    };

    const handleTimeOptionChange = (e) => {
        setSelectedTimeOption(e.target.value);
    };
    const handleShowToast = () => setShowToast(true);

    return (
        <Card style={{ background: '#fff', border: "none", boxShadow: 'none' }}>
            <Card.Body>
                <Row>
                    <div className="text-end" style={{ marginTop: "30px" }}>
                        <BsFilterLeft size={17} onClick={toggleActiveState} />
                    </div>
                    {!isOpenAndClose ?
                        <Card className="mt-3" style={{ background: '#fff', border: "none", boxShadow: 'none' }}>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Card style={{ background: '#fff', border: "none", boxShadow: 'none' }}>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={6}>
                                                        <Accordion defaultActiveKey="0">
                                                            <Accordion.Item eventKey="0">
                                                                <Accordion.Header>
                                                                    Tìm kiếm
                                                                </Accordion.Header>
                                                                <Accordion.Body>
                                                                    <Form>
                                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                                            <Form.Control type="text" placeholder="Theo mã hóa đơn" className="small-font" style={{ fontSize: '12px' }} />
                                                                        </Form.Group>
                                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                                            <Form.Control type="text" placeholder="Theo mã, tên bảng" className="small-font" style={{ fontSize: '12px' }} />
                                                                        </Form.Group>
                                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                                            <Form.Control type="text" placeholder="Theo mã, điện thoại khách hàng" className="small-font" style={{ fontSize: '12px' }} />
                                                                        </Form.Group>
                                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                                            <Form.Control type="text" placeholder="Theo ghi chú" className="small-font" style={{ fontSize: '12px' }} />
                                                                        </Form.Group>
                                                                        <Form.Select
                                                                            size="sm"
                                                                            style={{
                                                                                border: 'none',
                                                                                borderBottom: '1px solid #E5E5E5',
                                                                                fontSize: "12px",
                                                                                color: "#595C5F"
                                                                            }}
                                                                        >
                                                                            <option>Chọn phòng</option>
                                                                            <option>P.20</option>
                                                                            <option>P.21</option>
                                                                            <option>P.23</option>
                                                                            <option>P.24</option>
                                                                            <option>P.25</option>
                                                                        </Form.Select>
                                                                        <Form.Select
                                                                            className="mt-3"
                                                                            size="sm"
                                                                            style={{
                                                                                border: 'none',
                                                                                borderBottom: '1px solid #E5E5E5',
                                                                                fontSize: "12px",
                                                                                color: "#595C5F"
                                                                            }}
                                                                        >
                                                                            <option>Bảng giá</option>
                                                                            <option>100,000 VND</option>
                                                                            <option>120,000 VND</option>
                                                                            <option>150,000 VND</option>
                                                                            <option>200,000 VND</option>
                                                                            <option>250,000 VND</option>
                                                                        </Form.Select>
                                                                    </Form>
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        </Accordion>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Card>
                                                            <Card.Body>
                                                                <Card.Title style={{ fontSize: '13px' }}>Thời gian đặt</Card.Title>

                                                                {/* Radio cho phần chọn select */}
                                                                <Form.Group className="mb-3 mt-3" controlId="timeOption">
                                                                    <InputGroup>
                                                                        <InputGroup.Radio
                                                                            name="timeOption"
                                                                            checked={selectedRadio === 'selectOption'}
                                                                            onChange={() => handleRadioChange('selectOption')}
                                                                            aria-label="Radio button for following select input"
                                                                        />
                                                                        <Form.Select
                                                                            aria-label="Select input with radio button"
                                                                            style={{ border: '1px solid #eee' }}
                                                                            value={selectedTimeOption} // Giá trị select lưu vào state
                                                                            onChange={handleTimeOptionChange} // Hàm thay đổi giá trị select
                                                                            disabled={selectedRadio !== 'selectOption'} // Disable nếu radio không được chọn
                                                                        >
                                                                            <option value="">Hôm nay</option>
                                                                            <option value="1">Hôm qua</option>
                                                                            <option value="2">Tuần này</option>
                                                                            <option value="3">Tuần trước</option>
                                                                            <option value="4">7 ngày</option>
                                                                        </Form.Select>
                                                                    </InputGroup>
                                                                </Form.Group>

                                                                {/* Radio cho phần chọn khoảng thời gian (date range) */}
                                                                <Form.Group className="mb-3" controlId="timeOptionText">
                                                                    <InputGroup>
                                                                        <InputGroup.Radio
                                                                            name="timeOption"
                                                                            checked={selectedRadio === 'textInput'}
                                                                            onChange={() => handleRadioChange('textInput')}
                                                                            aria-label="Radio button for following text input"
                                                                        />
                                                                        <Form.Control
                                                                            aria-label="Text input with date range picker"
                                                                            value={timeRange} // Giá trị được lưu ở đây sau khi chọn ngày
                                                                            placeholder="Chọn thời gian"
                                                                            className={selectedRadio === 'textInput' ? 'input-enabled' : 'input-disabled'}
                                                                            onClick={handleShowToast}  // Hiển thị Toast khi nhấp vào ô thứ 2
                                                                            readOnly
                                                                            disabled={selectedRadio !== 'textInput'} // Disable nếu radio không được chọn
                                                                        />
                                                                    </InputGroup>
                                                                </Form.Group>
                                                            </Card.Body>
                                                        </Card>
                                                        <Toast
                                                            show={showToast}
                                                            onClose={() => setShowToast(false)}
                                                            style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', zIndex: 999999999 }}
                                                        >
                                                            <Toast.Header>
                                                                <strong className="me-auto">Chọn khoảng thời gian</strong>
                                                            </Toast.Header>
                                                            <Toast.Body>
                                                                <Row>
                                                                    <Col md={6}>
                                                                        <DatePicker
                                                                            label="Từ ngày"
                                                                            id="startDate"
                                                                            value={startDate}
                                                                            onChange={(e) => setStartDate(e.target.value)}
                                                                        />
                                                                    </Col>
                                                                    <Col md={6}>
                                                                        <DatePicker
                                                                            label="Đến ngày"
                                                                            id="endDate"
                                                                            value={endDate}
                                                                            onChange={(e) => setEndDate(e.target.value)}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                                <button className="btn btn-primary mt-3" onClick={handleSaveDateRange}>
                                                                    Lưu
                                                                </button>
                                                            </Toast.Body>
                                                        </Toast>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card style={{ background: '#fff', border: "none", boxShadow: 'none' }}>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={6}>
                                                        <Accordion defaultActiveKey="0">
                                                            <Accordion.Item eventKey="0">
                                                                <Accordion.Header style={{ fontSize: "18px", color: "blue", fontWeight: "bold" }}>
                                                                    Trạng thái
                                                                </Accordion.Header>
                                                                <Accordion.Body>
                                                                    <Form>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="trang-thai"
                                                                            label={<span style={{ fontSize: "12px" }}>Hoàn thành</span>}
                                                                        />
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="da-huy"
                                                                            label={<span style={{ fontSize: "12px" }}>Đã hủy</span>}
                                                                        />
                                                                    </Form>
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        </Accordion>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Accordion defaultActiveKey="0">
                                                            <Accordion.Item eventKey="0">
                                                                <Accordion.Header style={{ fontSize: "18px", color: "blue", fontWeight: "bold" }}>
                                                                    Phương thức
                                                                </Accordion.Header>
                                                                <Accordion.Body>
                                                                    <Form>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="trang-thai"
                                                                            label={<span style={{ fontSize: "12px" }}>Tiền mặt</span>}
                                                                        />
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id="da-huy"
                                                                            label={<span style={{ fontSize: "12px" }}>Chuyển khoản</span>}
                                                                        />
                                                                    </Form>
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        </Accordion>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card></Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        :
                        ""
                    }
                </Row>
                <Row>
                    <TableInfo />
                </Row>
            </Card.Body>
        </Card>
    );
}

export { InvoiceContainer };
