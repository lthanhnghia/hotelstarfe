import React, { useEffect } from "react";
import Layoutemployee from "../../../components/layout/employee";
import DatPhong from "./modalDatPhong";
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from "react-bootstrap";
import Confirm from "./table-confirm";
import CheckedOut from "./table-checked-out";
import Reserved from "./table-reserved";
import InUse from "./table-in-use";
import OverTime from "./table-overtime";
import CreateInvoice from "./create-invoice";
import { format } from "date-fns";
import { Cookies } from "react-cookie";
import { getAllBooking } from "../../../services/employee/order-room-manager";
import { Link, useLocation } from 'react-router-dom';
import "../home/FillterDate/style.css"
import { cilList } from "@coreui/icons";
import Maintenance from "./table-maintenance";

const ListReservation = () => {
    const [filterType, setFilterType] = useState(null);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [ShowInserRoom, setShowInsertRoom] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const cookie = new Cookies();
    const token = cookie.get("token");
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const searchBookings = (bookings, searchTerm) => {
        if (!searchTerm) return bookings; // Nếu không có từ khóa tìm kiếm, trả về tất cả các bookings

        return bookings.filter((booking) => {
            const customerName = booking.accountDto?.fullname?.toLowerCase() || '';
            const bookingCode = booking.id?.toString().toLowerCase() || '';

            return customerName.includes(searchTerm.toLowerCase()) || bookingCode.includes(searchTerm.toLowerCase());
        });
    };

    // Áp dụng filterBookings và searchBookings
    const filteredAndSearchedBookings = searchBookings(bookings, searchTerm);

    useEffect(() => {
        handleBooking(filterType, formatDateTime(startDate), formatDateTime(endDate), token);
    }, [filterType, startDate, endDate, location]);
    useEffect(() => {
    }, [filteredBookings]);

    const handleStartDateChange = (selectedDate) => {
        setStartDate(selectedDate);
    };
    const handleEndDateChange = (selectedDate) => {
        setEndDate(selectedDate);
    };

    const handleShowModalInserRoom = () => {
        setShowInsertRoom(true);
    };
    const handleCloseModalInserRoom = () => {
        setShowInsertRoom(false);
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    const handleReload = () => {
        handleBooking(filterType, formatDateTime(startDate), formatDateTime(endDate), token);
    }

    const handleBooking = async (filterType, startDate, endDate, token) => {
        const data = await getAllBooking(startDate, endDate, token);
        if (data) {
            setBookings(data);
            setFilteredBookings(filterBookings(filteredAndSearchedBookings));
        }
    }

    const formatDateTime = (date) => {
        if (!date || isNaN(new Date(date))) {
            return null;
        }
        return format(new Date(date), 'yyyy-MM-dd');
    };
    const filterBookings = (bookings) => {
        return bookings.filter((booking) => {
            // Kiểm tra nếu tất cả các phòng đều có checkIn === null
            const allCheckInNull = booking.bookingRooms?.every(room => room.checkIn === null) ?? false;

            // Kiểm tra cả 2 điều kiện: statusBookingDto.id === 7 và có ít nhất một phòng có checkIn khác null
            return (booking.statusBookingDto.id === 7 || !allCheckInNull) && booking.statusBookingDto.id !== 8 && booking.statusBookingDto.id !== 6 && booking.statusBookingDto.id !== 2 && booking.statusBookingDto.id !== 1;
        });
    };



    const renderTabContent = (tab) => {
        let bookingsForTab = [];
        switch (tab) {
            case "choxacnhan":
                bookingsForTab = filteredAndSearchedBookings.filter((e) => e.statusBookingDto?.id === 2 || e.statusBookingDto?.id === 1);
                break;
            case "datra":
                bookingsForTab = filteredAndSearchedBookings.filter((e) => e.statusBookingDto?.id === 8);
                break;
            case "dattruoc":
                bookingsForTab = filteredAndSearchedBookings.filter((e) => e.statusBookingDto?.id === 4);
                break;
            case "dangsudung":
                bookingsForTab = filteredBookings;
                break;
            case "quagio":
                bookingsForTab = filteredAndSearchedBookings.filter(
                    (e) => e.statusBookingDto?.id === 4 && new Date(e.endAt) < new Date()
                );
                break;
            case "chotaohoadon":
                bookingsForTab = filteredAndSearchedBookings.filter((e) => e.statusBookingDto?.id === 6);
                break;
            case "baotri":
                bookingsForTab = filteredAndSearchedBookings.filter((e) => e.statusBookingDto?.id === 10);
                break;
            default:
                return <p>Không có dữ liệu</p>;
        }

        return renderComponentForTab(tab, bookingsForTab);
    };

    const renderComponentForTab = (tab, bookingsForTab) => {
        switch (tab) {
            case "choxacnhan":
                return <Confirm item={bookingsForTab} />;
            case "datra":
                return <CheckedOut item={bookingsForTab} />;
            case "dattruoc":
                return <Reserved item={bookingsForTab} />;
            case "dangsudung":
                return <InUse item={bookingsForTab} />;
            case "quagio":
                return <OverTime item={bookingsForTab} />;
            case "chotaohoadon":
                return <CreateInvoice item={bookingsForTab} />;
            default:
                return <Maintenance item={bookingsForTab}/>;
        }
    };



    return (
        <Layoutemployee title={"Danh sách đặt phòng"} icons={cilList}>
            <div className="container-fluid">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                    <div className="product-search">
                        <div className="form-control-wrapper">
                            <div className="form-control autocomplete">
                                <input
                                    type="text"
                                    className="input-unstyled"
                                    placeholder="Tìm theo mã, tên khách hàng"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="form-control-prefix">
                                <i className="fa fa-search icon-mask" style={{ marginLeft: "10px" }}></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="toolbar-item justify-content-end mb-3 d-flex align-items-center" style={{ flexWrap: "wrap" }}>
                    {/* <div className="toolbar-select mb-2 me-3" style={{ flex: "0 0 auto" }}>
                        <select
                            className="date-filter-input"
                            value={filterType}
                            onChange={handleFilterChange}
                            aria-label="Default select example"
                        >
                            <option value="">Chọn thời gian</option>
                            <option value="1">Ngày</option>
                            <option value="7">Tuần</option>
                            <option value="30">Tháng</option>
                        </select>
                    </div> */}
                    <div className="date-picker-container mb-2 me-2" style={{ flex: "0 1 auto" }}>
                        <DatePicker
                            id="date-picker"
                            selected={startDate}
                            placeholderText="Chọn ngày bắt đầu"
                            onChange={handleStartDateChange}
                            className="date-filter-input"
                            dateFormat="dd/MM/yyyy"
                            style={{ minHeight: "44px" }}
                        />
                    </div>
                    <div className="date-picker-container mb-2" style={{ flex: "0 1 auto" }}>
                        <DatePicker
                            id="date-picker"
                            selected={endDate}
                            placeholderText="Chọn ngày kết thúc"
                            onChange={handleEndDateChange}
                            className="date-filter-input"
                            dateFormat="dd/MM/yyyy"
                            style={{ minHeight: "44px" }}
                        />
                    </div>
                    <Link to={`/employee/booking-offline`}>
                        <Button
                            className="mx-3 mb-2"
                            onClick={handleShowModalInserRoom}
                            variant="success">
                            <i className="fa fa-plus icon-btn"></i>
                            <span className="m-2">Đặt phòng</span>
                        </Button>
                    </Link>

                </div>
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active" id="pills-choxacnhan-tab"
                            data-bs-toggle="pill" data-bs-target="#pills-choxacnhan"
                            type="button" role="tab"
                            aria-controls="pills-choxacnhan"
                            aria-selected="false" onClick={handleReload}>Chờ xác nhận</button>
                        <button class="nav-link" id="pills-dattruoc-tab" data-bs-toggle="pill"
                            data-bs-target="#pills-dattruoc" type="button"
                            role="tab" aria-controls="pills-dattruoc"
                            aria-selected="false" onClick={handleReload}>Đã đặt trước</button>
                        <button class="nav-link" id="pills-dangsudung-tab" data-bs-toggle="pill"
                            data-bs-target="#pills-dangsudung" type="button"
                            role="tab" aria-controls="pills-dangsudung"
                            aria-selected="false" onClick={handleReload}>Đang sử dụng</button>
                        <button class="nav-link" id="pills-quagio-tab"
                            data-bs-toggle="pill" data-bs-target="#pills-quagio"
                            type="button" role="tab" aria-controls="pills-quagio"
                            aria-selected="false" onClick={handleReload}>Quá giờ trả</button>
                        <button class="nav-link" id="pills-datra-tab"
                            data-bs-toggle="pill" data-bs-target="#pills-datra"
                            type="button" role="tab" aria-controls="pills-datra"
                            aria-selected="false" onClick={handleReload}>Hoàn thành</button>
                        <button class="nav-link" id="pills-chotaohoadon-tab" data-bs-toggle="pill"
                            data-bs-target="#pills-chotaohoadon" type="button"
                            role="tab" aria-controls="pills-chotaohoadon"
                            aria-selected="false" onClick={handleReload}>Đã hủy</button>
                        <button class="nav-link" id="pills-baotri-tab" data-bs-toggle="pill"
                            data-bs-target="#pills-baotri" type="button"
                            role="tab" aria-controls="pills-baotri"
                            aria-selected="false" onClick={handleReload}>Bảo trì</button>

                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="pills-choxacnhan"
                        role="tabpanel" aria-labelledby="pills-choxacnhan-tab">
                        {renderTabContent("choxacnhan")}
                    </div>
                    <div className="tab-pane fade" id="pills-datra" role="tabpanel"
                        aria-labelledby="pills-datra-tab">
                        {renderTabContent("datra")}
                    </div>
                    <div className="tab-pane fade" id="pills-dattruoc" role="tabpanel"
                        aria-labelledby="pills-dattruoc-tab">
                        {renderTabContent("dattruoc")}
                    </div>
                    <div className="tab-pane fade" id="pills-dangsudung" role="tabpanel"
                        aria-labelledby="pills-dangsudung-tab">
                        {renderTabContent("dangsudung")}
                    </div>
                    <div className="tab-pane fade" id="pills-quagio" role="tabpanel"
                        aria-labelledby="pills-quagio-tab">
                        {renderTabContent("quagio")}
                    </div>
                    <div className="tab-pane fade" id="pills-chotaohoadon"
                        role="tabpanel" aria-labelledby="pills-chotaohoadon-tab">
                        {renderTabContent("chotaohoadon")}
                    </div>
                    <div className="tab-pane fade" id="pills-baotri"
                        role="tabpanel" aria-labelledby="pills-baotri-tab">
                        {renderTabContent("baotri")}
                    </div>
                </div>


                <div className="tab-content" id="pills-tabContent">

                </div>
                <div className="d-flex spacer pb-4 pt-4 flex-center-between ng-star-inserted">
                    <div className="spacer align-items-center">
                        {/* <span>Tổng <strong className="text-success">{filteredAndSearchedBookings.length}</strong> đặt phòng</span> */}
                        <button className="btn btn-sm btn-outline-success" onClick={handleReload}>
                            <i className="fa fa-rotate icon-btn"></i>
                            <span>Tải lại</span>
                        </button>
                    </div>
                </div>
            </div>
            {ShowInserRoom && <DatPhong onClose={handleCloseModalInserRoom} />}
        </Layoutemployee>
    )

}

export default ListReservation;
