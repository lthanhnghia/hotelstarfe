import React, { useEffect, useState } from 'react';
import LayoutAdmin from '../../../../components/layout/admin/DefaultLayout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReservationTable from './reservation-table';
import { Button, Card, Form } from 'react-bootstrap';
import ReservationChart from './reservation-chart';
import { getReservationReport } from '../../../../services/admin/reservation';
import { format } from 'date-fns';
import Alert from '../../../../config/alert';

// import RevenueChart from './revenue-chart';

const ReservationReport = () => {
    const [checkinDate, setCheckinDate] = useState(null);
    const [checkoutDate, setCheckoutDate] = useState(null);
    const [view, setView] = useState('table');
    const [bookings, setBookings] = useState([]);
    const [alert, setAlert] = useState(null);

    const handleViewChange = (event) => {
        setView(event.target.id);
    };

    const formatDate = (dateString) => {
        if (dateString) {
          return format(new Date(dateString), "yyyy-MM-dd");
        }
        return "yyyy-MM-dd";
      };
    useEffect(() => {
        if (!checkinDate && !checkoutDate) {
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            setCheckinDate(sevenDaysAgo);
            setCheckoutDate(today);
            handleBookingReservation(formatDate(sevenDaysAgo), formatDate(today));
        }
        setTimeout(() => setAlert(null), 500);
    }, [checkinDate, checkoutDate]);

    const handleBookingReservation = async (startDate, endDate) => {
        const data = await getReservationReport(startDate, endDate);
        setBookings(data);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (checkoutDate && checkinDate && new Date(checkoutDate) < new Date(checkinDate)) {
            setAlert({ type: "error", title: "Ngày kết thúc không thể nhỏ hơn ngày bắt đầu." });
            return;
        } else {
            handleBookingReservation(formatDate(checkinDate), formatDate(checkoutDate));
        }
    };

    return (
        <LayoutAdmin>
            {alert && <Alert type={alert.type} title={alert.title} />}
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
                                    dateFormat="dd-MM-yyyy"
                                />
                            </div>
                            <div className="col-md-6" style={{ marginTop: "30px" }}>
                                <DatePicker
                                    className="custom-date-picker"
                                    selected={checkoutDate}
                                    onChange={date => setCheckoutDate(date)}
                                    placeholderText="Ngày kết thúc"
                                    dateFormat="dd-MM-yyyy"
                                />
                            </div>
                            <div className='col-md-12'>
                                <Button
                                    type="submit"
                                    style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', width: "100%" }}
                                    variant="outline-success"
                                >
                                    Lưu thay đổi
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {view === 'chart' ? (
                <ReservationChart booking={bookings} startDate={checkinDate} endDate={checkoutDate}/>
            ) : (
                <ReservationTable booking={bookings} checkinDate={checkinDate} checkoutDate={checkoutDate}/>
            )}
        </LayoutAdmin>
    );
};

export default ReservationReport;