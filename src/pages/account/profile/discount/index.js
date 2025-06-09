import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { request } from "../../../../config/configApi";

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const Discount = () => {
    const [discounts, setDiscounts] = useState([]);
    const token = Cookies.get('token');
    const decodedTokens = token ? jwt_decode(token) : null;
    const id_account = decodedTokens?.id || null;

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const response = await request({
                    method: 'GET',
                    path: `/api/discount/get-discount-by-account?id_account=${id_account}`,
                });

                if (response) {
                    // Xử lý dữ liệu trả về từ API
                    const formattedDiscounts = response.map(item => ({
                        id: item[0],                 // id
                        discountName: item[1],       // Tên giảm giá
                        percent: item[2],            // Phần trăm giảm giá
                        startDate: item[3],          // Ngày bắt đầu
                        endDate: item[4],            // Ngày kết thúc
                        status: item[5],             // Trạng thái
                    }));

                    setDiscounts(formattedDiscounts);
                }
            } catch (error) {
                console.error('Lỗi:', error);
            }
        };

        fetchDiscounts();
    }, [id_account]);

    return (
        <div>
            <h3>Giảm giá của bạn</h3>
            <div className="row">
                {discounts.map((discount, index) => {
                    const endDate = new Date(discount.endDate);
                    const now = new Date();

                    // Xác định trạng thái:
                    let status = {};
                    if (discount.status) {
                        // Đã sử dụng
                        status = { text: 'Đã sử dụng', color: 'badge bg-danger text-wrap' };
                    } else if (endDate < now) {
                        // Hết hạn chưa sử dụng
                        status = { text: 'Hết hạn', color: 'badge bg-secondary text-wrap' };
                    } else {
                        // Còn hạn, chưa sử dụng
                        status = { text: 'Chưa sử dụng', color: 'badge bg-success text-wrap' };
                    }

                    return (
                        <div className="col-md-4 mb-4" key={index}>
                            <div className="card" style={{
                                background: 'linear-gradient(135deg, #f9d423, #ff4e50)',
                                color: 'white',
                            }}>
                                <div className="card-body" style={{ width: '100%' }}>
                                    <div className="text-center">
                                        <h5>🎉{discount.discountName}🎉</h5>
                                        <p>
                                            Giảm giá lên đến <strong>{discount.percent || 0}%</strong>!
                                        </p>
                                        <p>
                                            {formatDate(discount.startDate)} {'->'} {formatDate(discount.endDate)}
                                        </p>
                                    </div>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span>Trạng thái:</span>
                                        <span className={status.color}>{status.text}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Discount;
