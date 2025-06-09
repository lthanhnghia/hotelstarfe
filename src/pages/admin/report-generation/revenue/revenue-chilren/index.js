import React, { useEffect, useState } from "react";
import { getStartDateWithInvoice } from "../../../../../services/admin/reservation";
import { formatCurrency, formatDateTime } from "../../../../../config/formatPrice";
import { getIdBooking } from "../../../../../config/idBooking";

const RevenueChilren = ({ bookingDate }) => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (bookingDate) {
            handleGetData(bookingDate);
        }
    })

    const handleGetData = async (date) => {
        const data = await getStartDateWithInvoice(date);
        setBookings(data);
    }
    return (
        <tr>
            <td colSpan="4" style={{ padding: '0' }}>
                <table style={{ width: '97%', borderCollapse: 'collapse', margin: "15px" }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Mã giao dịch</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Thời gian</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Khách hàng</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Doanh thu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings && bookings.length > 0 ? (
                            bookings.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{ padding: '8px', border: '1px solid #ddd', color: '#1976d2', cursor: 'pointer' }}>{`HD${getIdBooking(item.id, item.invoiceDtos[0].id)}`}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatDateTime(item.invoiceDtos[0].createAt)}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.accountDto.fullname}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatCurrency(item.invoiceDtos[0].totalAmount)}</td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', padding: '8px', border: '1px solid #ddd' }}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </td>
        </tr>
    )
}

export default RevenueChilren;