import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'; // Nhập các thành phần cần thiết từ thư viện recharts
import '../../../../../assets/css/admin/css/chart.css'; // Nhập CSS cho biểu đồ

// Dữ liệu cho biểu đồ
const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
];

const BarChartExample = () => {
    return (
        <div className="container-fluid mt-4"> {/* Khởi tạo khung chứa chính */}
            <div className="card"> {/* Thẻ card để chứa nội dung */}
                <div className="card-body body-card"> {/* Nội dung chính của thẻ card */}
                    <div className="row align-items-center mb-3"> {/* Hàng chứa tiêu đề và chọn ngày */}
                        <div className="col-12 col-md-6"> {/* Phần tiêu đề */}
                            <h5 className="card-title">Công suất sử dụng phòng</h5> {/* Tiêu đề biểu đồ */}
                        </div>
                        <div className="col-12 col-md-6 text-end"> {/* Phần chọn ngày */}
                            <select className="form-select form-select-sm w-slot" aria-label=".form-select-sm example"> {/* Dropdown cho các lựa chọn thời gian */}
                                <option value="1" selected>Hôm nay</option>
                                <option value="2">Hôm qua</option>
                                <option value="3">7 ngày qua</option>
                                <option value="4">Tháng này</option>
                                <option value="5">Tháng trước</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ width: '100%', height: '300px' }}> {/* Khung chứa biểu đồ */}
                        <ResponsiveContainer width="100%" height="100%"> {/* Đảm bảo biểu đồ tự động điều chỉnh kích thước */}
                            <BarChart data={data}> {/* Khởi tạo biểu đồ cột với dữ liệu */}
                                <CartesianGrid strokeDasharray="3 3" /> {/* Lưới biểu đồ với đường gạch chéo */}
                                <XAxis dataKey="name" /> {/* Trục X sử dụng giá trị trong trường 'name' làm nhãn */}
                                <YAxis /> {/* Trục Y mặc định */}
                                <Tooltip /> {/* Hiển thị tooltip khi hover lên các cột dữ liệu */}
                                <Legend /> {/* Hiển thị chú thích cho các cột trong biểu đồ */}
                                <Bar dataKey="value" fill="#0094DA" barSize={30}/> {/* Cột biểu diễn dữ liệu sử dụng trường 'value' với màu sắc #8884d8 */}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BarChartExample; // Xuất thành phần để sử dụng
