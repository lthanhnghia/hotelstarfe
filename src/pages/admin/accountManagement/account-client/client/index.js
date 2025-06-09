import {
    CAvatar,
    CBadge,
    CButton,
    CCardBody,
    CCollapse,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import CustomerInformation from "./customer-information";
import BookingHistory from "./booking-history";
import { getAllEmployee, updateActiveAccount } from "../../../../../services/admin/account-manager";
import ReactPaginate from "react-paginate";
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from "../../../../../config/alert";
import { Button, Card } from "react-bootstrap";

const Account = () => {
    const [details, setDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activePage, setActivePage] = useState(0);
    const [user, setUser] = useState([]);
    const [alert, setAlert] = useState(null);
    const [tabs, setTabs] = useState({});  // State to manage tabs for each item
    const itemsPerPage = 5;

    useEffect(() => {
        handleGetAllClient();
    }, []);

    const handleGetAllClient = async () => {
        try {
            const res = await getAllEmployee();
            const user = res.filter((e) => e.roleDto.roleName === "Customer");
            setUser(user);
        } catch (error) {
            setAlert({ type: 'error', title: 'Lỗi khi tải dữ liệu khách hàng' });
        }
    };

    const getBadge = (status) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Inactive': return 'secondary';
            case 'Pending': return 'warning';
            case 'Khóa': return 'danger';
            default: return 'primary';
        }
    };

    const toggleDetails = (index) => {
        const position = details.indexOf(index);
        let newDetails = details.slice();
        if (position !== -1) {
            newDetails.splice(position, 1);
        } else {
            newDetails = [...details, index];
        }
        setDetails(newDetails);
    };

    const filteredItems = user.filter(item =>
        item.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roleDto.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.isDelete ? "hoạt động" : "khóa").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startOffset = activePage * itemsPerPage;
    const endOffset = startOffset + itemsPerPage;
    const currentItems = filteredItems.slice(startOffset, endOffset);
    const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

    const handlePageClick = (event) => {
        setActivePage(event.selected);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setActivePage(0);
    };

    const handleToggleDeleteStatus = async (id) => {
        try {
            await updateActiveAccount(id);
            setUser((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id
                        ? { ...user, isDelete: !user.isDelete }
                        : user
                )
            );
            setAlert({ type: 'success', title: 'Cập nhật trạng thái thành công' });
            setTimeout(() => setAlert(null), 3000);
        } catch (error) {
            setAlert({ type: 'error', title: 'Xảy ra lỗi khi cập nhật trạng thái' });
        }
    };

    const handleTabChange = (itemId, tabName) => {
        setTabs((prevTabs) => ({
            ...prevTabs,
            [itemId]: tabName
        }));
    };

    // Mặc định cho tất cả các item sẽ mở tab "Thông tin" khi lần đầu tiên render
    const setDefaultTab = (itemId) => {
        if (!tabs[itemId]) {
            setTabs((prevTabs) => ({
                ...prevTabs,
                [itemId]: 'info'  // Mặc định mở tab 'info'
            }));
        }
    };

    return (
        <div className="account-client">
            {alert && <Alert type={alert.type} title={alert.title} />}
            <input
                type="text"
                placeholder="Tìm kiếm..."
                onChange={handleSearch}
                className="mb-3 form-control"
                style={{ width: "20%" }}
            />
            <CTable responsive className="table-bordered">
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Ảnh</CTableHeaderCell>
                        <CTableHeaderCell>Họ tên</CTableHeaderCell>
                        <CTableHeaderCell>Số điện thoại</CTableHeaderCell>
                        <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                        <CTableHeaderCell>Hành động</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {currentItems.map((item) => (
                        <React.Fragment key={item.id}>
                            {setDefaultTab(item.id)}  {/* Gọi để thiết lập mặc định */}
                            <CTableRow>
                                <CTableDataCell>
                                    <CAvatar src={item.avatar} />
                                </CTableDataCell>
                                <CTableDataCell>{item.fullname}</CTableDataCell>
                                <CTableDataCell>{item.phone}</CTableDataCell>
                                <CTableDataCell>
                                    <CBadge color={getBadge(item.isDelete ? "Active" : "Khóa")}>{item.isDelete ? "hoạt động" : "khóa"}</CBadge>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <Button
                                        variant="outline-success"
                                        size="sm"
                                        onClick={() => toggleDetails(item.id)}
                                    >
                                        {details.includes(item.id) ? 'Ẩn' : 'Hiện'}
                                    </Button>
                                </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell colSpan="12">
                                    <CCollapse visible={details.includes(item.id)}>
                                            <CCardBody style={{ width: "auto" }}>
                                                <ul className="nav nav-tabs" role="tablist">
                                                    <li className="nav-item">
                                                        <button
                                                            className={`nav-link ${tabs[item.id] === 'info' ? 'active' : ''}`}
                                                            onClick={() => handleTabChange(item.id, 'info')}
                                                        >
                                                            Thông tin
                                                        </button>
                                                    </li>
                                                    <li className="nav-item">
                                                        <button
                                                            className={`nav-link ${tabs[item.id] === 'bookingHistory' ? 'active' : ''}`}
                                                            onClick={() => handleTabChange(item.id, 'bookingHistory')}
                                                        >
                                                            Lịch sử đặt phòng
                                                        </button>
                                                    </li>
                                                </ul>
                                                <div className="tab-content">
                                                    {tabs[item.id] === "info" && (
                                                        <div className="tab-pane fade show active">
                                                            <CustomerInformation item={item} onToggleDeleteStatus={() => handleToggleDeleteStatus(item.id)} />
                                                        </div>
                                                    )}
                                                    {tabs[item.id] === "bookingHistory" && (
                                                        <div className="tab-pane fade show active">
                                                            <BookingHistory id={item.id} />
                                                        </div>
                                                    )}
                                                </div>
                                            </CCardBody>
                                    </CCollapse>
                                </CTableDataCell>
                            </CTableRow>
                        </React.Fragment>
                    ))}
                </CTableBody>
            </CTable>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                previousLabel="<"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={pageCount}
                containerClassName="pagination justify-content-center mt-4"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active rounded"
            />
        </div>
    );
};

export default Account;
