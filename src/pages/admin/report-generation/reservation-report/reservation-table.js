import React, { useState } from 'react';
import ReservationChilrenTable from './reservation-chilren-table';
import * as XLSX from 'xlsx';
import "../revenue/style.css";
import { Button } from 'react-bootstrap';
import { formatCurrency, formatDate } from '../../../../config/formatPrice';

const ReservationTable = ({ booking, checkinDate, checkoutDate }) => {
    const [expandedRows, setExpandedRows] = useState({});
    const [expandAll, setExpandAll] = useState(false); // Quản lý mở tất cả các dòng
    const [exportType, setExportType] = useState('');

    // Mở hoặc đóng một dòng cụ thể
    const toggleExpand = (date) => {
        setExpandedRows((prevExpandedRows) => ({
            ...prevExpandedRows,
            [date]: !prevExpandedRows[date],
        }));
    };

    // Mở hoặc đóng tất cả các dòng
    const toggleExpandAll = () => {
        setExpandAll((prevExpandAll) => !prevExpandAll);
    };

    // Tạo trạng thái mở rộng cho tất cả các dòng
    const getExpandedRows = () => {
        if (expandAll) {
            const allRowsExpanded = {};
            booking.forEach(item => {
                allRowsExpanded[item.bookingDate] = true;
            });
            return allRowsExpanded;
        }
        return expandedRows;
    };

    const handleExportPDF = () => {
        window.print();
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(booking); // Chuyển dữ liệu JSON sang định dạng sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Report"); // Tạo workbook và thêm sheet
        XLSX.writeFile(workbook, "RevenueReport.xlsx"); // Xuất file với tên "RevenueReport.xlsx"
    };

    const handleExport = () => {
        if (exportType === 'excel') {
            handleExportExcel();
        } else if (exportType === 'pdf') {
            handleExportPDF();
        }
    };

    return (
        <div
            style={{
                margin: '20px',
                padding: '20px',
                fontFamily: 'Arial, sans-serif',
                border: '2px solid #ddd',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                backgroundColor: '#fff',
            }}
            className="revenue-content"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <select
                    value={exportType}
                    onChange={(e) => setExportType(e.target.value)}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    <option value="">Chọn loại xuất</option>
                    <option value="excel">Xuất Excel</option>
                    <option value="pdf">Xuất PDF</option>
                </select>
                <h2 style={{ marginRight: '80px' }}>Báo cáo đặt phòng </h2>

                <Button
                    onClick={handleExport}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    variant="success"
                    disabled={!exportType} // Vô hiệu hóa khi chưa chọn loại xuất
                >
                    Xuất
                </Button>
            </div>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>Từ ngày {formatDate(checkinDate)} đến ngày {formatDate(checkoutDate)}</p>
            <table style={{ border: '1px solid #ddd', width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }} onClick={toggleExpandAll}>
                            <button
                                onClick={toggleExpandAll}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    color: '#000000',
                                    background: 'none',
                                    border: 'none',
                                    marginRight: "5px",
                                    padding: '0',
                                    textAlign: 'left',
                                }}
                            >
                                {expandAll ? "-" : "+"}
                            </button>
                            Thời gian
                        </th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>SL đặt phòng</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>SL phòng đặt</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Giá trị đặt phòng</th>
                    </tr>
                </thead>
                <tbody>
                    {booking && booking.length > 0 ? (
                        booking.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }} onClick={() => toggleExpand(item.bookingDate)}>
                                        <button
                                            onClick={() => toggleExpand(item.bookingDate)}
                                            style={{
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                color: '#000000',
                                                background: 'none',
                                                border: 'none',
                                                padding: '0',
                                                textAlign: 'left',
                                            }}
                                        >
                                            {getExpandedRows()[item.bookingDate] ? '+' : '−'} {item.bookingDate}
                                        </button>
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{item.totalBookings}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{item.totalRoomsBooked}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{formatCurrency(item.totalBookingValue)}</td>
                                </tr>
                                {getExpandedRows()[item.bookingDate] && (
                                    <tr>
                                        <td colSpan="5">
                                            <ReservationChilrenTable bookingDate={item.bookingDate} /> {/* Pass bookingDate if needed */}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td className='text-center' colSpan="5">Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationTable;
