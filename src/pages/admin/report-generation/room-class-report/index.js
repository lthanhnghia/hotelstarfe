import React, { useState } from 'react';
import LayoutAdmin from '../../../../components/layout/admin/DefaultLayout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RoomClassTable from './table';
import { Card, Form } from 'react-bootstrap';
import RoomClassChart from './chart';

const RoomClassReport = () => {
    const [checkinDate, setCheckinDate] = useState(null);
    const [checkoutDate, setCheckoutDate] = useState(null);
    const [view, setView] = useState('table'); // Default to table view

    const handleViewChange = (event) => {
        setView(event.target.id);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Ngăn chặn hành vi gửi mặc định
        // Xử lý dữ liệu ở đây, ví dụ: gửi đến API hoặc hiển thị thông báo
        console.log("Ngày bắt đầu:", checkinDate);
        console.log("Ngày kết thúc:", checkoutDate);
    };

    return (
        <LayoutAdmin>
            <div className="row mb-3 d-flex justify-content-center">
                <div className="col-md-2 mb-3 mb-sm-0 mt-2">
                    <Card style={{ padding: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <Card.Body>
                            <Card.Title><strong className='fs-6'>Kiểu hiển thị</strong></Card.Title>
                            <Form>
                                <Form.Check
                                    type="radio"
                                    label="Sơ đồ"
                                    onChange={handleViewChange}
                                    id="chart"
                                    checked={view === 'chart'}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Báo cáo"
                                    onChange={handleViewChange}
                                    id="table"
                                    checked={view === 'table'}
                                />
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
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

            {view === 'chart' ? (
                <RoomClassChart/>
            ) : (
                <RoomClassTable />
            )}
        </LayoutAdmin>
    );
};

export default RoomClassReport;