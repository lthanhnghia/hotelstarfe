import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import '../../../../../assets/css/admin/css/dashboard.css';
import { InfoRoomOccupancy, InfoRoomUsage } from './Service';
import DatePicker from 'react-datepicker';
import { South } from '@mui/icons-material';

const COLORS1 = ['#D4EADD', '#279656'];
const COLORS2 = ['#EA800E', '#FEE7CF'];

// Thành phần DonutChart nhận dữ liệu và màu sắc từ props
const DonutChart = ({ data, colors }) => {
    const total = data.reduce((sum, entry) => sum + entry.value, 0);
    const percentage = ((data[0].value / total) * 100).toFixed(1); // Tính tỷ lệ phần trăm

    return (
        <PieChart width={200} height={200}>
            <Pie
                data={data}
                cx={100}
                cy={100} // Vị trí vòng tròn trung tâm
                innerRadius={60}
                outerRadius={70}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
            </Pie>
            <Tooltip />
            <text
                x={107}  // Căn giữa theo trục X
                y={107}  // Căn giữa theo trục Y
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={16}
                fill="#000"
            >
                {`${percentage}%`} {/* Hiển thị tỷ lệ phần trăm */}
            </text>
        </PieChart>
    );
};


const RoomPowerComponent = () => {
    const [roomOccupancy, setRoomOccupancy] = useState({});
    const [roomUsage, setUsage] = useState({});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const parseDate = (date) => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const today = new Date();
        setStartDate(today);
        setEndDate(today);
    }, []);

    const getRoomOccupancy = async (startDate, endDate) => {
        try {
            if (startDate && endDate) {
                const res = await InfoRoomOccupancy(parseDate(startDate), parseDate(endDate));
                setRoomOccupancy(res);
            }
        } catch (error) {
            console.log("Lỗi gọi dữ liệu từ api: ", error);
        }
    };

    const getRoomUsage = async (startDate, endDate) => {
        try {
            if (startDate && endDate) {
                const res = await InfoRoomUsage(parseDate(startDate), parseDate(endDate));
                setUsage(res);
            }
        } catch (error) {
            console.log("Lỗi gọi dữ liệu từ api:", error);
        }
    };

    useEffect(() => {
        const finalStartDate = startDate || new Date();
        const finalEndDate = endDate || new Date();

        getRoomOccupancy(finalStartDate, finalEndDate);
        getRoomUsage(finalStartDate, finalEndDate);
    }, [startDate, endDate]);

    // Dữ liệu cho biểu đồ công suất phòng
    const data1 = [
        { name: 'Tổng phòng', value: roomOccupancy.totalRooms - (roomOccupancy.occupiedRooms || 0) },
        { name: 'Có khách', value: roomOccupancy.occupiedRooms || 0 },
    ];

    // Dữ liệu cho biểu đồ phòng trống
    const data2 = [
        { name: 'Phòng đặt trước', value: roomUsage.occupiedRooms || 0 }, // "Currently in use"
        { name: 'Tổng phòng', value: roomUsage.totalRooms - (roomUsage.occupiedRooms || 0) - (roomUsage.reservedRooms || 0) }, // "Available Rooms"
    ];


    // Tính tỉ lệ công suất phòng có khách
    const occupancyRate = roomOccupancy.totalRooms && roomOccupancy.occupiedRooms ?
        ((roomOccupancy.occupiedRooms / roomOccupancy.totalRooms) * 100).toFixed(1) : 0;

    // Tính tỉ lệ phòng trống
    const usagePercentage = roomUsage.totalRooms && roomUsage.occupiedRooms ?
        ((roomUsage.occupiedRooms / roomUsage.totalRooms) * 100).toFixed(1) : 0;

    const handleStartDateChange = (date) => {
        // Cập nhật ngày bắt đầu
        setStartDate(date);

        // Nếu ngày kết thúc nhỏ hơn hoặc bằng ngày bắt đầu
        if (!endDate || date >= endDate) {
            const correctedEndDate = new Date(date);
            correctedEndDate.setDate(correctedEndDate.getDate() + 1); // Thêm 1 ngày
            setEndDate(correctedEndDate); // Cập nhật ngày kết thúc
        }
    };

    const handleEndDateChange = (date) => {
        // Nếu người dùng chọn ngày kết thúc nhỏ hơn ngày bắt đầu
        if (startDate && date < startDate) {
            const correctedStartDate = new Date(date);
            correctedStartDate.setDate(correctedStartDate.getDate() - 1); // Lấy ngày trước đó cho ngày bắt đầu
            setStartDate(correctedStartDate);
            setEndDate(date);
        } else {
            // Nếu hợp lệ, cập nhật ngày kết thúc
            setEndDate(date);
        }
    };


    return (
        <div className="container-fluid mt-4">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-7">
                            <h5 className="card-title text-start">Công suất phòng hiện tại</h5>
                        </div>
                        <div className="col-md-5">
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="startDate" className="form-label">Ngày bắt đầu:</label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleStartDateChange} // Sử dụng hàm handleStartDateChange
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="endDate" className="form-label">Ngày kết thúc:</label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={handleEndDateChange}  // Sử dụng hàm handleEndDateChange
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="row mt-4 align-items-center">
                        <div className="col-md-6 d-flex flex-column align-items-center mb-3">
                            <DonutChart data={data1} colors={COLORS1} />
                            <p style={{ fontSize: '14px', margin: '2px 0' }}>{`${roomOccupancy.occupiedRooms} / ${roomOccupancy.totalRooms}`}</p>
                            <p style={{ fontSize: '14px', margin: '2px 0' }}>Đang có khách</p>
                        </div>
                        <div className="col-md-6 d-flex flex-column align-items-center mb-3">
                            <DonutChart data={data2} colors={COLORS2} />
                            <p style={{ fontSize: '14px', margin: '2px 2px' }}>
                                {`${roomUsage.occupiedRooms} / ${roomUsage.totalRooms}`}
                            </p>
                            <p style={{ fontSize: '14px', margin: '2px 2px' }}>Phòng đặt trước</p>
                            <p style={{ fontSize: '14px', margin: '2px 2px' }}>Tỉ lệ: {usagePercentage}%</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomPowerComponent;

