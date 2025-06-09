import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Tab, Table, Tabs } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";

const invoiceData = [
    {
        id: 'HD001',
        date: '2024-10-01',
        room: 'Phòng A',
        customer: 'Nguyễn Văn A',
        discount: '10%',
        totalAfterDiscount: '900,000 VND',
        amountPaid: '1,000,000 VND',
        electronicInvoice: 'Đã xác nhận',
        status: 'Đã thanh toán',
        cashier: 'Nguyễn Văn A',
        account: 'Tài khoản A',
        notes: 'Khách đã thanh toán bằng tiền mặt.',
        paymentHistory: [
            { date: '2024-10-01', amount: '900,000 VND', method: 'Tiền mặt' },
            { date: '2024-10-02', amount: '100,000 VND', method: 'Chuyển khoản' },
        ],
        employee: {
            id: '4'
        }
    },
    {
        id: 'HD002',
        date: '2024-10-02',
        room: 'Phòng B',
        customer: 'Trần Thị B',
        discount: '15%',
        totalAfterDiscount: '850,000 VND',
        amountPaid: '1,000,000 VND',
        electronicInvoice: 'Chờ phát hành',
        status: 'Chưa thanh toán',
        cashier: 'Lê Văn C',
        account: 'Tài khoản B',
        notes: 'Khách yêu cầu thanh toán vào cuối tháng.',
        paymentHistory: [
            { date: '2024-10-02', amount: '500,000 VND', method: 'Chuyển khoản' },
            { date: '2024-10-05', amount: '350,000 VND', method: 'Tiền mặt' },
        ],
        employee: {
            id: '2'
        }
    },
    {
        id: 'HD003',
        date: '2024-10-03',
        room: 'Phòng C',
        customer: 'Lê Văn C',
        discount: '5%',
        totalAfterDiscount: '950,000 VND',
        amountPaid: '1,000,000 VND',
        electronicInvoice: 'Đã xác nhận',
        status: 'Đã thanh toán',
        cashier: 'Nguyễn Thị B',
        account: 'Tài khoản C',
        notes: 'Thanh toán trực tiếp tại quầy.',
        paymentHistory: [
            { date: '2024-10-03', amount: '950,000 VND', method: 'Tiền mặt' },
        ],
        employee: {
            id: '1'
        }
    }
];

const cashierOptions = [
    { id: '1', name: 'Nguyễn Văn A' },
    { id: '2', name: 'Lê Văn C' },
    { id: '3', name: 'Nguyễn Thị B' }
]
const TableInfo = () => {
    // Khởi tạo state để lưu trữ các hàng đã chọn và hàng đang mở rộng
    const [selectedRow, setSelectedRow] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);

    // State để quản lý phân trang
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [entriesPerPage] = useState(2); // Số lượng mục hiển thị trên mỗi trang

    // Tính toán các mục hiện tại dựa trên trang hiện tại và số lượng mục trên mỗi trang
    const indexOfLastEntry = currentPage * entriesPerPage; // Chỉ số cuối cùng của mục trên trang hiện tại
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage; // Chỉ số đầu tiên của mục trên trang hiện tại
    const currentEntries = invoiceData.slice(indexOfFirstEntry, indexOfLastEntry); // Các mục hiển thị trên trang hiện tại

    // Tính toán tổng số trang
    const totalPages = Math.ceil(invoiceData.length / entriesPerPage);

    // Hàm xử lý thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // Cập nhật trang hiện tại khi người dùng thay đổi
    };

    // Hàm xử lý khi người dùng chọn hoặc bỏ chọn một hàng
    const handleSelectRow = (id) => {
        setSelectedRow((prevSelectedRow) =>
            prevSelectedRow.includes(id)
                ? prevSelectedRow.filter((rowId) => rowId !== id) // Nếu hàng đã được chọn, bỏ chọn nó
                : [...prevSelectedRow, id] // Nếu hàng chưa được chọn, thêm nó vào danh sách
        );
    };

    // Hàm xử lý khi người dùng chọn hoặc bỏ chọn tất cả các hàng
    const handleSelectAll = (isChecked) => {
        setSelectedRow(isChecked ? invoiceData.map((invoice) => invoice.id) : []); // Chọn tất cả hoặc bỏ chọn tất cả
    };

    // Hàm xử lý khi người dùng mở rộng hoặc thu gọn một hàng
    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id); // Mở rộng nếu chưa mở rộng, thu gọn nếu đã mở rộng
    };

    // Hàm xử lý khi người dùng thay đổi thu ngân
    const handleCashierChange = (event) => {
        const selectedCashierId = event.target.value;
        // Bạn có thể sử dụng selectedCashierId để cập nhật trạng thái của hóa đơn hoặc thực hiện một hành động khác
        console.log('Thu ngân đã chọn:', selectedCashierId);
    };

    return (
        <Card style={{ border: 'none', boxShadow: 'none' }}>
            <Card.Body>
                <Table striped bordered size="sm" responsive className="mt-3">
                    <thead>
                        <tr>
                            <th>
                                <Form.Check
                                    type="checkbox"
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    checked={selectedRow.length === invoiceData.length}
                                />
                            </th>
                            <th>Mã hóa đơn</th>
                            <th>Thời gian</th>
                            <th>Tên phòng</th>
                            <th>Khách hàng</th>
                            <th>Giảm giá</th>
                            <th>Tổng sau giảm giá</th>
                            <th>Khách trả</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEntries.map((item) => ( // Hiển thị currentEntries thay vì toàn bộ invoiceData
                            <React.Fragment key={item.id}>
                                <tr onClick={() => toggleRow(item.id)} style={{ cursor: 'pointer' }}>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            onChange={() => handleSelectRow(item.id)}
                                            checked={selectedRow.includes(item.id)}
                                        />
                                    </td>
                                    <td>{item.id}</td>
                                    <td>{item.date}</td>
                                    <td>{item.room}</td>
                                    <td>{item.customer}</td>
                                    <td>{item.discount}</td>
                                    <td>{item.totalAfterDiscount}</td>
                                    <td>{item.amountPaid}</td>
                                </tr>
                                {expandedRow === item.id && (
                                    <tr>
                                        <td colSpan="8">
                                            <Card style={{ border: 'none', boxShadow: 'none' }} >
                                                <Card.Body>
                                                    <Row>
                                                        <Tabs
                                                            defaultActiveKey="home"
                                                            id={`tabs-${item.id}`}
                                                            className="mb-3"
                                                        >
                                                            <Tab eventKey="home" title="Thông tin">
                                                                <Row className="mt-3">
                                                                    <Col xs={12} md={4}>
                                                                        <div className="border-bottom-invoice">
                                                                            <p>Mã hóa đơn: <strong>{item.id}</strong></p>
                                                                        </div>
                                                                        <div className="border-bottom-invoice">
                                                                            <p> Mã đặt phòng: <strong>{item.room}</strong></p>
                                                                        </div>
                                                                        <div className="border-bottom-invoice">
                                                                            <p>Thời gian: <strong>{item.date}</strong></p>
                                                                        </div>
                                                                        <div className="border-bottom-invoice">
                                                                            <p>Khách hàng: <strong>{item.customer}</strong></p>
                                                                        </div>
                                                                        <div className="border-bottom-invoice">
                                                                            <p>Hóa đơn điện tử: <strong>{item.electronicInvoice}</strong></p>
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={12} md={4}>
                                                                        <div className="border-bottom-invoice">
                                                                            <p>Trạng thái: <strong>{item.status}</strong></p>
                                                                        </div>
                                                                        <div className="border-bottom-invoice d-flex align-items-center" style={{marginTop: "-19px"}}>
                                                                            <p className="mb-0 me-2">Thu ngân: </p>
                                                                            <Form.Select
                                                                                aria-label="Chọn thu ngân"
                                                                                style={{ width: 'auto', border: 'none', color: '#6B6B6B', marginTop: "21px" }}
                                                                                onChange={handleCashierChange} // Gọi hàm khi có sự thay đổi
                                                                            >
                                                                                <option value="">Chọn người bán</option>
                                                                                {cashierOptions.map((option) => ( // Sử dụng cashierOptions từ biến đã định nghĩa
                                                                                    <option key={option.id} value={option.id}>
                                                                                        {option.name}
                                                                                    </option>
                                                                                ))}
                                                                            </Form.Select>
                                                                        </div>
                                                                        <div className="border-bottom-invoice">
                                                                            <p>Tài khoản: <strong>{item.account}</strong></p>
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={12} md={4}>
                                                                        <p>Ghi chú: <strong>{item.notes}</strong></p>
                                                                    </Col>
                                                                </Row>
                                                            </Tab>

                                                            <Tab eventKey="profile" title="Lịch sử thanh toán">
                                                                <p>Chi tiết lịch sử thanh toán cho {item.customer}</p>
                                                            </Tab>
                                                        </Tabs>
                                                    </Row>
                                                </Card.Body>
                                                <Card.Footer>
                                                    <Row>
                                                        <div className="text-end">
                                                            <button className="btn btn-success">
                                                                <FaSave size={16} />&nbsp;
                                                                Lưu
                                                            </button>
                                                            &nbsp;	&nbsp;
                                                            <button className="btn btn-danger">
                                                                <ImCancelCircle size={16} />&nbsp;
                                                                Hủy
                                                            </button>
                                                        </div>
                                                    </Row>
                                                </Card.Footer>
                                            </Card>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>
                {/* Thanh phân trang */}
                <div className="d-flex justify-content-center mt-3">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index}
                            variant={currentPage === index + 1 ? "primary" : "outline-primary"}
                            onClick={() => handlePageChange(index + 1)}
                            className="me-2"
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
};

export { TableInfo };
