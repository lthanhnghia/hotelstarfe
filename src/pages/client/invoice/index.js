import React from 'react';
import LayoutClient from '../../../components/layout/cilent';
import "./style.css";
const Invoice = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <LayoutClient>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '10px', fontFamily: 'Arial, sans-serif', border: '1px solid #ddd' }}>
                <div className="invoice-content">
                    <header style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <p>Khách sạn Stars</p>
                        <p>Điện thoại: 1900 6522</p>
                    </header>

                    <section style={{ borderBottom: '1px solid #ddd', paddingBottom: '20px', marginBottom: '20px' }}>
                        <h2 style={{ textAlign: 'center' }}>HÓA ĐƠN BÁN HÀNG</h2>
                        <p style={{ textAlign: 'center' }}>HD000076</p>
                    </section>

                    <section style={{ marginBottom: '20px' }}>
                        <p><strong>Khách hàng:</strong> Khách lẻ</p>
                        <p><strong>Mã đặt phòng:</strong> DP000010</p>
                        <p><strong>Thu ngân:</strong> -</p>
                    </section>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nội dung</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Đơn giá</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>SL</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Phòng 02 giường đơn (Phòng) P.501</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>23,200,000</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>23,200,000</td>
                            </tr>
                        </tbody>
                    </table>

                    <section style={{ marginBottom: '20px', textAlign: 'right' }}>
                        <p><strong>Tổng tiền hàng:</strong> 23,200,000</p>
                        <p><strong>Chiết khấu:</strong> 0</p>
                        <p><strong>Tổng cộng:</strong> 23,200,000</p>
                    </section>

                    <footer style={{ textAlign: 'center', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                        <p>Cảm ơn và hẹn gặp lại</p>
                    </footer>
                </div>
                <button onClick={handlePrint} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                    In hóa đơn
                </button>
            </div>
        </LayoutClient>
    );
};

export default Invoice;
