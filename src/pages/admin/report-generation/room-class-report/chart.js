import React from 'react';
import { CChartBar } from '@coreui/react-chartjs';

const RoomClassChart = () => {
    // Map dữ liệu labels và dataset từ data prop
    const roomRevenueData = [
        { roomName: 'Phòng 01 giường đôi cho 2 người', revenue: 6840000 },
        { roomName: 'Phòng 02 giường đơn', revenue: 4500000 },
        { roomName: 'Phòng 03 giường đôi có view biển', revenue: 89300000 },
        { roomName: 'Phòng 04 giường đơn có view biển', revenue: 7300000 },
        { roomName: 'Phòng 05 giường đôi có view biển', revenue: 5300000 },
    ];

    const labels = roomRevenueData.map(item => item.roomName);
    const revenues = roomRevenueData.map(item => item.revenue);

    return (
        <div style={{
            maxWidth: "900px",
            margin: '20px auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            border: '2px solid #ddd',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            backgroundColor: '#fff',
        }}>
            <h3 style={{ textAlign: 'center' }}>Doanh thu theo hạng phòng</h3>
            <CChartBar
                data={{
                    labels: labels,
                    datasets: [
                        {
                            label: 'Doanh thu',
                            backgroundColor: '#00A5E3',
                            data: revenues,
                        },
                    ],
                }}
                options={{
                    indexAxis: 'y',
                    scales: {
                        x: {
                            ticks: {
                                callback: function (value) {
                                    return value >= 1000000 ? `${value / 1000000} tr` : `${value / 1000}k`;
                                },
                            },
                            beginAtZero: true,
                            max: Math.max(...revenues) * 1.2, // Tự động đặt giá trị tối đa cho trục x theo dữ liệu
                        },
                        y: {
                            ticks: {
                                autoSkip: false,
                                maxRotation: 0,
                                minRotation: 0,
                            },
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const value = context.raw.toLocaleString('vi-VN');
                                    return `${context.label}: ${value}`;
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default RoomClassChart;
