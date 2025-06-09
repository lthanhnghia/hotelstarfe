import React from "react";

const OrderRoomTable = () => {
    return (
        <tr>
            <td colSpan={5} style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px' }}>
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: '#f7f3d6', padding: '8px', border: '1px solid #ddd' }}>Mã hóa đơn</th>
                            <th style={{ backgroundColor: '#f7f3d6', padding: '8px', border: '1px solid #ddd' }}>Thời gian</th>
                            <th style={{ backgroundColor: '#f7f3d6', padding: '8px', border: '1px solid #ddd' }}>Khách hàng</th>
                            <th style={{ backgroundColor: '#f7f3d6', padding: '8px', border: '1px solid #ddd' }}>Tiền phòng</th>
                            <th style={{ backgroundColor: '#f7f3d6', padding: '8px', border: '1px solid #ddd' }}>Tiền dịch vụ</th>
                            <th style={{ backgroundColor: '#f7f3d6', padding: '8px', border: '1px solid #ddd' }}>Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd', color: '#1976d2', cursor: 'pointer' }}>HD000077</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>01/11/2024 14:21</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>Lê Minh Khôi</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>3,099,092</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>100,000</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>3,199,000</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    )
}

export default OrderRoomTable;