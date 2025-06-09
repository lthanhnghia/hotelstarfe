import React from 'react';

const BookingInfo = ({ token, rooms, selectedRooms, totalPrice, discount }) => {
    const formatDate = (date, format = "DD/MM/YYYY") => {
        if (!date) return "";
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        if (format === "DD/MM/YYYY") {
            return `${day}/${month}/${year}`;
        }
        return d.toLocaleDateString(); // Or add other formats if necessary
    };

    // Calculate the number of days between check-in and check-out
    const calculateNumberOfDays = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDifference = end - start;
        return timeDifference > 0 ? timeDifference / (1000 * 3600 * 24) : 0; // Days in milliseconds
    };


    // Calculate total price based on rooms and days
    const calculateTotalPrice = (rooms, selectedRooms) => {
        const numberOfDays = calculateNumberOfDays(rooms.startDate, rooms.endDate);
        let total = 0;
        selectedRooms.forEach(item => {
            total += item.price * numberOfDays; // Room price per day multiplied by number of days
        });
        return total;
    };

    const totalRoomPrice = calculateTotalPrice(rooms, selectedRooms);

    const discountPercent = discount ? discount.percent : 0;
    const discountAmount = discountPercent > 0 ? (totalRoomPrice * discountPercent) / 100 : 0;
    const discountedPrice = totalRoomPrice - discountAmount;



    return (
        <div className="col-md-5">
            <h3 className='booking-title'>Xác thực thông tin</h3>
            <div className="hotel-page-sidebar" style={{ background: '#f9f9f9', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <div className="box-summary">
                    {/* Customer Information */}
                    <div className="summary-total" style={{ marginTop: '20px' }}>
                        <h4>Thông tin khách hàng</h4>
                        <table className="tlb-info" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                        <div className="title">Họ và tên</div>
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                                        <div className="info-right">{token.fullname}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                        <div className="title">Email</div>
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                                        <div className="info-right">{token.email}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                        <div className="title">Số điện thoại</div>
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                                        <div className="info-right">{token.phone}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Room Details */}
                    <div className="summary-total" style={{ marginTop: '20px' }}>
                        <h4>Chi tiết phòng</h4>
                        <table className="tlb-info" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                        <div className="title">
                                            <i className="fa fa-calendar" style={{ marginRight: '5px' }}></i> Ngày nhận phòng
                                        </div>
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                                        <div className="info-right">{rooms.startDate ? formatDate(rooms.startDate) : "N/A"} 14:00</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                        <div className="title">
                                            <i className="fas fa-calendar-check" style={{ marginRight: '5px' }}></i> Ngày trả phòng
                                        </div>
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                                        <div className="info-right">{rooms.endDate ? formatDate(rooms.endDate) : "N/A"} 12:00</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Room Cost */}
                    <div className="summary-total" style={{ marginTop: '20px' }}>
                        <h4>Chi phí phòng</h4>
                        <table className="tlb-info tlb-info-price" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {selectedRooms.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            <div className="title">{item.roomName}</div>
                                        </td>
                                        <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                                            <div className="info-right">
                                                {(item.price * calculateNumberOfDays(rooms.startDate, rooms.endDate)).toLocaleString()} VND
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {discountPercent > 0 && (
                                    <tr>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            <div className="title">Giảm giá</div>
                                        </td>
                                        <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                                            <div className="info-right" style={{ color: '#d9534f' }}>
                                                {discountAmount.toLocaleString()} VND
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                <tr className="tr-total">
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                        <div className="title">Số tiền cần thanh toán</div>
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                                        <div className="info-right" style={{ fontWeight: 'bold', color: '#d9534f' }}>
                                            {discountedPrice.toLocaleString()} VND
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingInfo;
