import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css"; // Import file CSS tùy chỉnh
import { Button } from "react-bootstrap";
import { cilCalendar } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import MaintenanceModal from "../modal-maintenance-schedule";
const FillterDateHome = ({ onDatesChange }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [showModal, setSgowModal] = useState(false);

    const handleCloseModal = () => {
        setSgowModal(false);
    }

    const handleShowModal = () => {
        setSgowModal(true);
    }

    const handleDateChange = (type, date) => {
        if (type === 'start') {
            setStartDate(date);
            onDatesChange(date, endDate); // Gọi callback với giá trị mới
        } else {
            setEndDate(date);
            onDatesChange(startDate, date); // Gọi callback với giá trị mới
        }
    };

    return (
        <div className="d-flex justify-content-end me-4 mb-4">
            <div className="me-3">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => handleDateChange('start', date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    isClearable
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Chọn ngày bắt đầu"
                    className="date-filter-input"
                />
            </div>
            <div>
                <Button variant="outline-success" onClick={handleShowModal}><CIcon icon={cilCalendar} customClassName="nav-icon" style={{fontSize: "12px", height: "18px", marginBottom: "4px", marginRight: "2px"}}/><span style={{fontSize: "14px"}}>Tạo lịch bảo trì</span></Button>
            </div>

            {showModal && <MaintenanceModal handleClose={handleCloseModal}/>}
        </div>
    );
};


export default FillterDateHome;
