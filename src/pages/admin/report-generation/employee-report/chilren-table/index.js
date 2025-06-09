import React from "react";

const EmployeeReportChilren = () => {
    return (
        <tr>
            <td colSpan="4" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px' }}>
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: '#f7f3d6', padding: '8px', border: '1px solid #ddd' }}>Mã dịch vụ</th>
                            <th style={{ backgroundColor: '#f7f3d6', padding: '8px', border: '1px solid #ddd' }}>Tên dịch vụ</th>
                            <th style={{ backgroundColor: '#f7f3d6', padding: '8px', border: '1px solid #ddd' }}>SL bán</th>
                            <th style={{ backgroundColor: '#f7f3d6', padding: '8px', border: '1px solid #ddd' }}>Giá dịch vụ</th>
                            <th style={{ backgroundColor: '#f7f3d6', padding: '8px', border: '1px solid #ddd' }}>Doanh thu</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd', color: '#1976d2', cursor: 'pointer' }}>DV002</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>Đánh golf</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>1</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>29,000,000</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>29,000,000</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd', color: '#1976d2', cursor: 'pointer' }}>DV002</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>Đánh golf</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>1</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>29,000,000</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>29,000,000</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    )
}

export default EmployeeReportChilren;