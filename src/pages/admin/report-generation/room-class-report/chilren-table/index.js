import React, { useState } from 'react';
import OrderRoomTable from './order-room-table';

const RoomTable = () => {
    const [expandedRows, setExpandedRows] = useState({});

    const toggleExpand = (id) => {
        setExpandedRows((prevExpandedRows) => ({
            ...prevExpandedRows,
            [id]: !prevExpandedRows[id],
        }));
    };
    const rows = [
        {
            id: 'P.209',
            quantityOrder: '2',
            roomMoney: '52,920,000',
            serviceMoney: '0',
            total: '52,920,000',
        },
        {
            id: 'P.207',
            quantityOrder: '2',
            roomMoney: '52,920,000',
            serviceMoney: '0',
            total: '52,920,000',
        },
    ];

    return (
        <tr>
            <td colSpan={6} style={{ padding: '0' }}>
            <table style={{ border: '1px solid #ddd', width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ backgroundColor: 'rgb(226 216 146)', padding: '10px', border: '1px solid #ddd' }}>Số phòng</th>
                        <th style={{ backgroundColor: 'rgb(226 216 146)', padding: '10px', border: '1px solid #ddd' }}>SL hóa đơn</th>
                        <th style={{ backgroundColor: 'rgb(226 216 146)', padding: '10px', border: '1px solid #ddd' }}>Tiền phòng</th>
                        <th style={{ backgroundColor: 'rgb(226 216 146)', padding: '10px', border: '1px solid #ddd' }}>Tiền dịch vụ</th>
                        <th style={{ backgroundColor: 'rgb(226 216 146)', padding: '10px', border: '1px solid #ddd' }}>Tổng tiền</th>
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
                                        {expandedRows[row.id] ? '-' : '+'} {row.id}
                                    </button>
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{row.quantityOrder}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{row.roomMoney}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{row.serviceMoney}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{row.total}</td>
                            </tr>
                            {expandedRows[row.id] && (
                                <OrderRoomTable />
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            </td>
        </tr>
    );
};

export default RoomTable;
