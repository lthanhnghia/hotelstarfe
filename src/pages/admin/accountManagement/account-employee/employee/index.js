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
import { Button, Card, Col, Row } from "react-bootstrap";
import AddEmployeeModal from "./modal-add-employee";
import { deleteAccountEmployee, getAllEmployee, updateActiveAccount } from "../../../../../services/admin/account-manager";
import ReactPaginate from "react-paginate";
import Alert from "../../../../../config/alert";
import AlertComfirm from "../../../../../config/alert/comfirm";

const Account = () => {
    const [details, setDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activePage, setActivePage] = useState(0);
    const itemsPerPage = 10;
    const [showModal, setShowModal] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [employees, setEmployee] = useState([]);
    const [itemAccount, setItemAccount] = useState({});
    const [alert, setAlert] = useState(null);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const getBadge = (status) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Inactive': return 'secondary';
            case 'Pending': return 'warning';
            case 'Khóa': return 'danger';
            default: return 'primary';
        }
    };
    useEffect(() => {
        handleGetAllEmployee();
        setTimeout(() => setAlert(null), 500);
    }, [alert]);
    const refreshData = () => {
        handleGetAllEmployee();
    };
    const handleGetAllEmployee = async () => {
        try {
            const res = await getAllEmployee();
            const employee = res.filter((e) => e.roleDto.roleName === "Staff");
            setEmployee(employee);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
            setAlert({ type: 'error', title: 'Lỗi khi tải dữ liệu nhân viên' });
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

    const filteredItems = employees.filter(item =>
        item.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roleDto.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.isDelete ? "hoạt động" : "khóa").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startOffset = activePage * itemsPerPage;
    const endOffset = startOffset + itemsPerPage;
    const currentItems = filteredItems.slice(startOffset, endOffset);
    const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setActivePage(0);
    };

    const handlePageClick = (event) => {
        setActivePage(event.selected);
    };
    const handleToggleStatus = async (id) => {
        try {
            await updateActiveAccount(id);
            setEmployee((prevEmployees) =>
                prevEmployees.map((employee) =>
                    employee.id === id
                        ? { ...employee, isDelete: !employee.isDelete }
                        : employee
                )
            );
            setAlert({ type: 'success', title: 'Cập nhật trạng thái thành công' });
            setTimeout(() => setAlert(null), 3000);
        } catch (error) {
            setAlert({ type: 'error', title: 'Xảy ra lỗi khi cập nhật trạng thái' });
        }

    };
    const handleShowUpdate = (item) => {
        setItemAccount(item);
        setShowModalUpdate(true);
    }
    const handleCloseUpdate = () => setShowModalUpdate(false);

    const handleDeleteAccountEmployee = async (id) => {
        const confirmation = await AlertComfirm.confirm({
            type: "warning",
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa nhân viên này không?",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });

        if (confirmation) {
            try {
                // Gọi API xóa tài khoản nhân viên (thay thế với API của bạn)
                const response = await deleteAccountEmployee(id);  // Gọi API xóa nhân viên
                setAlert({ type: response.status, title: response.message })
                refreshData();
            } catch (error) {
                console.error("Error deleting employee:", error);
                setAlert({ type: 'error', title: 'Lỗi khi xóa nhân viên' });
            }
        }
    };

    return (
        <div className="account-client">
            {alert && <Alert type={alert.type} title={alert.title} />}
            <div className="d-flex justify-content-between">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    onChange={handleSearch}
                    className="mb-3 form-control"
                    style={{ width: "20%" }}
                />
                <Button
                    variant="success"
                    className="mx-3 p-0 pe-3 ps-3 text-right"
                    onClick={handleShow}
                    style={{ borderRadius: "0.6rem", height: "37px" }}>
                    <i className="fa fa-plus icon-btn"></i>
                    Thêm
                </Button>
            </div>
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
                            <CTableRow>
                                <CTableDataCell>
                                    <CAvatar src={item.avatar} />
                                </CTableDataCell>
                                <CTableDataCell>{item.fullname}</CTableDataCell>
                                <CTableDataCell>{item.phone}</CTableDataCell>
                                <CTableDataCell>
                                    <CBadge color={getBadge(item.isDelete ? "Active" : "Khóa")}>
                                        {item.isDelete ? "hoạt động" : "khóa"}
                                    </CBadge>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <Button
                                        variant="outline-success"
                                        size="sm"
                                        onClick={() => toggleDetails(item.id)}
                                        style={{ borderRadius: '5px' }}
                                    >
                                        {details.includes(item.id) ? 'Ẩn' : 'Hiện'}
                                    </Button>
                                </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell colSpan="6">
                                    <CCollapse visible={details.includes(item.id)}>
                                        <CCardBody style={{ width: "auto" }}>
                                            <h3>Thông tin nhân viên</h3>
                                            <Row className="mt-2">
                                                <Col xs={12} md={4}>
                                                    <div className="border-bottom-invoice">
                                                        <p>Mã nhân viên: <strong>{item.id}</strong></p>
                                                    </div>
                                                    <div className="border-bottom-invoice">
                                                        <p>Họ tên: <strong>{item.fullname}</strong></p>
                                                    </div>
                                                    <div className="border-bottom-invoice">
                                                        <p>Tài khoản: <strong>{item.username}</strong></p>
                                                    </div>
                                                    <div className="border-bottom-invoice">
                                                        <p>Email: <strong>{item.email}</strong></p>
                                                    </div>
                                                    <div className="border-bottom-invoice">
                                                        <p>Số điện thoại: <strong>{item.phone}</strong></p>
                                                    </div>
                                                </Col>
                                                <Col xs={12} md={4}>
                                                    <div className="form-check form-switch d-flex align-items-center border-bottom-invoice ps-0 mb-3 mt-3">
                                                        <label className="form-check-label me-3">Trạng thái:</label>
                                                        <div color="danger" className="me-5"></div>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            role="switch"
                                                            id="flexSwitchCheckChecked"
                                                            checked={item.isDelete} onChange={() => handleToggleStatus(item.id)}
                                                        />
                                                        {item.isDelete ? (<CBadge color="success" className="ms-2">Hoạt động</CBadge>) : (<CBadge color="danger" className="me-5">Khóa</CBadge>)}
                                                    </div>
                                                    <div className="border-bottom-invoice">
                                                        <p>Giới tính: <strong>{item.gender ? "Nam" : "Nữ"}</strong></p>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="d-flex justify-content-end me-5">
                                                <CButton size="sm" color="info" className="mx-2" onClick={() => handleShowUpdate(item)}>Cập nhật</CButton>
                                                <CButton size="sm" color="danger" className="ms-1" onClick={() => handleDeleteAccountEmployee(item.id)}>Xóa</CButton>
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
                activeClassName="active"
            />
            <AddEmployeeModal show={showModal} handleClose={handleClose} refreshData={refreshData} />
            <AddEmployeeModal show={showModalUpdate} handleClose={handleCloseUpdate} refreshData={refreshData} selectedEmployee={itemAccount} />
        </div>
    );
};

export default Account;
