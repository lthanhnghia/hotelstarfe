import React, { useState } from 'react';
import LayoutAdmin from '../../../../components/layout/admin/DefaultLayout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EmployeeReportTable from './employee-report-table';

const EmployeeReport = () => {
    const [checkinDate, setCheckinDate] = useState(null);
    const [checkoutDate, setCheckoutDate] = useState(null);
    const handleSubmit = (event) => {
        event.preventDefault(); // Ngăn chặn hành vi gửi mặc định
        // Xử lý dữ liệu ở đây, ví dụ: gửi đến API hoặc hiển thị thông báo
        console.log("Ngày bắt đầu:", checkinDate);
        console.log("Ngày kết thúc:", checkoutDate);
    };

    return (
        <LayoutAdmin>
            <div className="row mb-3 d-flex justify-content-center">
                <div className='col-md-4'>
                    <form onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className="col-md-6 mb-sm-0" style={{ marginTop: "30px" }}>
                                <DatePicker
                                    className="custom-date-picker"
                                    selected={checkinDate}
                                    onChange={date => setCheckinDate(date)}
                                    placeholderText="Ngày bắt đầu"
                                />
                            </div>
                            <div className="col-md-6" style={{ marginTop: "30px" }}>
                                <DatePicker
                                    className="custom-date-picker"
                                    selected={checkoutDate}
                                    onChange={date => setCheckoutDate(date)}
                                    placeholderText="Ngày kết thúc"
                                />
                            </div>
                            <div className='col-md-12'>
                                <button
                                    type="submit"
                                    style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', width: "100%" }}
                                    className="btn-primary"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        <EmployeeReportTable/>
        </LayoutAdmin>
    );
};

export default EmployeeReport;