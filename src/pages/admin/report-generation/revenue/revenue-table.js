import React, { useState } from 'react';
import RevenueChilren from './revenue-chilren';
import * as XLSX from 'xlsx';
import "./style.css";
import { Button } from 'react-bootstrap';
import { formatCurrency, formatDate } from '../../../../config/formatPrice';

const RevenueTable = ({ booking, bookings2, checkinDate, checkoutDate }) => {
    const [expandedRows, setExpandedRows] = useState({});
    const [exportType, setExportType] = useState('');
    const [expandAll, setExpandAll] = useState(false);

    const toggleExpand = (date) => {
        setExpandedRows((prevExpandedRows) => ({
            ...prevExpandedRows,
            [date]: !prevExpandedRows[date],
        }));
    };
    const toggleExpandAll = () => {
        setExpandAll((prevExpandAll) => !prevExpandAll);
    };
    const getExpandedRows = () => {
        if (expandAll) {
            const allRowsExpanded = {};
            bookings2.forEach(item => {
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
        const worksheet = XLSX.utils.json_to_sheet(bookings2); // Chuyển dữ liệu JSON sang định dạng sheet
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
                <h2 style={{ marginRight: '80px' }}>Báo cáo doanh thu </h2>
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
                    disabled={!exportType}
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
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Doanh thu</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Giá trị trả</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Doanh thu thuần</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ backgroundColor: '#f7f3d6', fontWeight: 'bold', textAlign: 'center' }}>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>Tổng</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatCurrency(booking.totalRevenue)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatCurrency(booking.refundedAmount)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatCurrency(booking.netRevenue)}</td>
                    </tr>
                    {bookings2 && bookings2.length > 0 ? (
                        bookings2.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }} onClick={() => toggleExpand(item.bookingDate)}>
                                        <button
                                            onClick={() => toggleExpand(item.bookingDate)}
                                            style={{
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                color: '#1976d2',
                                                background: 'none',
                                                border: 'none',
                                                padding: '0',
                                                textAlign: 'left',
                                            }}
                                        >
                                            {expandedRows[item.bookingDate] ? '+' : '−'} {item.bookingDate}
                                        </button>
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{formatCurrency(item.totalRevenue)}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{formatCurrency(item.refundedAmount)}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{formatCurrency(item.netRevenue)}</td>
                                </tr>
                                {getExpandedRows()[item.bookingDate] && (
                                    <RevenueChilren bookingDate={item.bookingDate}/>
                                )}
                            </React.Fragment>
                        ))
                    ) : ("")}

                </tbody>
            </table>
        </div>
    );
};

export default RevenueTable;
