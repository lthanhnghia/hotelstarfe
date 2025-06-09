import React, { useState } from 'react';
import RoomTable from './chilren-table';
import * as XLSX from 'xlsx';
import "../revenue/style.css";

const RoomClassTable = () => {
    const [expandedRows, setExpandedRows] = useState({});
    const [exportType, setExportType] = useState('');

    const toggleExpand = (id) => {
        setExpandedRows((prevExpandedRows) => ({
            ...prevExpandedRows,
            [id]: !prevExpandedRows[id],
        }));
    };

    const handleExportPDF = () => {
        window.print();
    };
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(rows); // Chuyển dữ liệu JSON sang định dạng sheet
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
    const rows = [
        {
            id: '000012',
            typeRoom: 'Phòng 01 giường đôi cho 2 người',
            quantityOrder: '2',
            roomMoney: '52,920,000',
            serviceMoney: '0',
            total: '52,920,000',
        },
        {
            id: '000013',
            typeRoom: 'Phòng 01 giường đơn',
            quantityOrder: '2',
            roomMoney: '52,920,000',
            serviceMoney: '0',
            total: '52,920,000',
        },
    ];

    return (
        <div
            style={{
                margin: '20px auto',
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
                
                <button
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
                    className="btn-primary"
                    disabled={!exportType} // Vô hiệu hóa khi chưa chọn loại xuất
                >
                    Xuất
                </button>
            </div>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>Từ ngày 28/10/2024 đến ngày 03/11/2024</p>
            <table style={{ border: '1px solid #ddd', width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ backgroundColor: '#FEA116', padding: '10px', border: '1px solid #ddd' }}>Mã loại phòng</th>
                        <th style={{ backgroundColor: '#FEA116', padding: '10px', border: '1px solid #ddd' }}>Loại phòng</th>
                        <th style={{ backgroundColor: '#FEA116', padding: '10px', border: '1px solid #ddd' }}>SL hóa đơn</th>
                        <th style={{ backgroundColor: '#FEA116', padding: '10px', border: '1px solid #ddd' }}>Tiền phòng</th>
                        <th style={{ backgroundColor: '#FEA116', padding: '10px', border: '1px solid #ddd' }}>Tiền dịch vụ</th>
                        <th style={{ backgroundColor: '#FEA116', padding: '10px', border: '1px solid #ddd' }}>Tổng tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    <button
                                        onClick={() => toggleExpand(row.id)}
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
                                        {expandedRows[row.id] ? '+' : '−'} {row.id}
                                    </button>
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{row.typeRoom}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{row.quantityOrder}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{row.roomMoney}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{row.serviceMoney}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{row.total}</td>
                            </tr>
                            {!expandedRows[row.id] && (
                                <RoomTable />
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoomClassTable;
