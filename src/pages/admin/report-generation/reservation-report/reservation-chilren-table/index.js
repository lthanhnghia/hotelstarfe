import React, { useEffect, useState } from "react";
import { getStartDateWithInvoice } from "../../../../../services/admin/reservation";
import { formatCurrency, formatDateTime } from "../../../../../config/formatPrice";
import { getIdBooking } from "../../../../../config/idBooking";

const ReservationChilrenTable = ({ bookingDate }) => {
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
            <td colSpan={5} style={{ padding: '0' }}>
                <table style={{ borderCollapse: 'collapse', margin: '14px' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Mã đặt phòng</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Thời gian</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Thời gian lưu trú</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Tên nhân viên</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Khách hàng</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>SL đặt phòng</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Tên phòng</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Giá trị đặt phòng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings && bookings.length > 0 ? (
                            bookings.map((item, index) => {
                                const roomNames = item.bookingRooms
                                .map(room => room.room?.roomName.replace("Phòng ", ""))
                                .join(", ");
                                return (
                                    <tr key={index}>
                                        <td style={{ padding: '8px', border: '1px solid #ddd', cursor: 'pointer' }}>
                                            {`HD${getIdBooking(item.id, item.invoiceDtos[0].id)}`}
                                        </td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                            {formatDateTime(item.createAt)}
                                        </td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                            {formatDateTime(item.startAt)} - {formatDateTime(item.endAt)}
                                        </td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                            {item.accountDto?.fullname || "Không có thông tin"}
                                        </td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                            {item.accountDto?.fullname || "Không có thông tin"}
                                        </td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                            {item.bookingRooms.length}
                                        </td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                            Phòng {roomNames}
                                        </td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                            {formatCurrency(item.invoiceDtos[0].totalAmount)}
                                        </td>
                                    </tr>
                                );
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

export default ReservationChilrenTable;