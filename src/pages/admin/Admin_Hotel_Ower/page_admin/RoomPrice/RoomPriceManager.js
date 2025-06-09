import React, { useState, useEffect } from "react";
import { Card, Container, Row, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { DeletePriceModal, RoomPriceModal } from "./ModalRoomPrice";
import './Style/BranchInfo.css';
import './Style/RoomRatesTable.css';
import { request } from "../../../../../config/configApi";
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { RoomTypeSelector, SearchBox, SearchDateBox } from "../RoomAndTypeRoom/Filter/FilterTypeRoom";
import Alert from "../../../../../config/alert";

const RoomRatesManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [discounts, setDiscounts] = useState([]);
    const [searchStartDate, setSearchStartDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");
    const [alert, setAlert] = useState("");
    const location = useLocation();

    useEffect(() => {
        const fetchDiscountData = async () => {
            const response = await request({
                method: "GET",
                path: '/api/discount/getAll',
                token: Cookies.get("token"),
            });
            if (response) {
                setDiscounts(response);
            }
        };
        fetchDiscountData();
    }, [location]);

    useEffect(() => {
        setAlert(null);
    }, [alert]);

    const handleSearch = (value) => {
        setSearchTerm(value.toLowerCase());
    };

    const handleChange = (value) => {
        if (searchEndDate && value > searchEndDate) {
            setAlert({ type: "error", title: "Ngày bắt đầu không được lớn hơn ngày kết thúc." });
        } else {
            setSearchStartDate(value);
            setAlert(null); // Xóa thông báo lỗi nếu hợp lệ
        }
    };

    const handleChangeEndDate = (value) => {
        if (searchStartDate && value < searchStartDate) {
            setAlert({ type: "error", title: "Ngày kết thúc không được nhỏ hơn ngày bắt đầu." });
        } else {
            setSearchEndDate(value);
            setAlert(null); // Xóa thông báo lỗi nếu hợp lệ
        }
    };


    return (
        <>
            {alert && <Alert type={alert.type} title={alert.title} />}
            <Container fluid>

                <Card>
                    <Card.Body>
                        <Row>
                            {/*Tìm kiếm và nút thêm */}
                            <RoomPriceSearchAndAdd onSearch={handleSearch} onChangeStartDate={handleChange}
                                onChangeEndDate={handleChangeEndDate} />
                        </Row>
                    </Card.Body>
                </Card>
                <Card>
                    {/*Bảng hệ thống giảm giá*/}
                    <RoomRatesTable discounts={discounts} searchTerm={searchTerm} searchStartDate={searchStartDate}
                        searchEndDate={searchEndDate} />
                </Card>
            </Container>
        </>
    );
};

const RoomPriceSearchAndAdd = ({ onSearch, onChangeStartDate, onChangeEndDate }) => {
    return (
        <div className="d-flex justify-content-between align-items-center p-3">
            <SearchBox
                onSearch={onSearch}
                placeholder="Tìm kiếm giảm giá..."
            />
            <div className="d-flex align-items-center">
                <span className="me-2">Ngày bắt đầu: </span>
                <SearchDateBox onChange={onChangeStartDate} />
            </div>
            <div className="d-flex align-items-center">
                <span className="me-2">Ngày kết thúc: </span>
                <SearchDateBox onChange={onChangeEndDate} />
            </div>
            {/* Thêm giá mới */}
            <RoomPriceModal />
        </div>
    );
};

const RoomRatesTable = ({ discounts, searchTerm, searchStartDate, searchEndDate }) => {
    const formattedDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };

    const [alert, setAlert] = useState("");
    const navigate = useNavigate();

    const filteredDiscounts = discounts.filter((item) => {
        const searchLower = searchTerm.toLowerCase();

        // Lọc theo tên giảm giá
        const isNameMatch = item.discountName.toLowerCase().includes(searchLower);

        // Lọc theo khoảng thời gian
        const startDate = item.startDate.substring(0, 10); // Lấy ngày bắt đầu của giảm giá
        const endDate = item.endDate.substring(0, 10); // Lấy ngày kết thúc của giảm giá

        const isDateInRange =
            (!searchStartDate || searchStartDate <= endDate) && // Nếu không có ngày bắt đầu, bỏ qua điều kiện
            (!searchEndDate || searchEndDate >= startDate); // Nếu không có ngày kết thúc, bỏ qua điều kiện

        // Chỉ giữ các mục thỏa mãn cả hai điều kiện
        return isNameMatch && isDateInRange;
    });

    // Hàm xử lý khi nhấn Ẩn hoặc Mở
    const handleHideDiscount = async (id) => {
        // Gọi API hoặc hành động để ẩn giảm giá
        const response = await request({
            method: "PATCH",
            path: `/api/discount/hide-discount/${id}`,
            token: Cookies.get("token"),
        });
        if (response && response.code === '200') {
            setAlert({ type: "success", title: "Ẩn giảm giá thành công." });
            navigate('/admin/discount');
        }
    };

    const handleOpenDiscount = async (id) => {
        // Gọi API hoặc hành động để mở giảm giá
        const response = await request({
            method: "PATCH",
            path: `/api/discount/show-discount/${id}`,
            token: Cookies.get("token"),
        });
        if (response && response.code === '200') {
            setAlert({ type: "success", title: "HIện giảm giá thành công." });
            navigate('/admin/discount');
        }
    };

    return (
        <>
            {alert && <Alert type={alert.type} title={alert.title} />}
            <Table responsive size="sm">
                <thead className="table-info">
                    <tr>
                        <th>STT</th>
                        <th>Tên giảm giá</th>
                        <th>Phần trăm giảm</th>
                        <th>Thời gian áp dụng</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDiscounts.map((item, index) => (
                        <tr key={item.id}>
                            <td style={{ backgroundColor: item.status === false ? '#e9ecef' : 'white' }}>{index + 1}</td>
                            <td style={{ backgroundColor: item.status === false ? '#e9ecef' : 'white' }}>{item.discountName}</td>
                            <td style={{ backgroundColor: item.status === false ? '#e9ecef' : 'white' }}>{item.percent} %</td>
                            <td style={{ backgroundColor: item.status === false ? '#e9ecef' : 'white' }}>
                                {item.startDate === item.endDate ? (
                                    <span>
                                        {formattedDate(item.startDate.substring(0, 10))}
                                    </span>
                                ) : (
                                    <>
                                        <span>
                                            {formattedDate(item.startDate.substring(0, 10))}
                                        </span>
                                        <span style={{ color: 'gray', fontWeight: 'bold', margin: '0 5px' }} >
                                            {'->'}
                                        </span>
                                        <span>
                                            {formattedDate(item.endDate.substring(0, 10))}
                                        </span>
                                    </>
                                )}
                            </td>
                            <td className="text-end" style={{ backgroundColor: item.status === false ? '#e9ecef' : 'white' }}>
                                {/* Hiển thị nút tùy theo trạng thái */}
                                {item.status ? (
                                    <small className="btn btn-outline-danger me-2" onClick={() => handleHideDiscount(item.id)}>
                                        Ẩn
                                    </small>
                                ) : (
                                    <small className="btn btn-outline-success me-2" onClick={() => handleOpenDiscount(item.id)}>
                                        Mở
                                    </small>
                                )}
                                {/* Các modal */}
                                <RoomPriceModal id={item.id} />
                                <DeletePriceModal id={item.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};


export default RoomRatesManagement;
