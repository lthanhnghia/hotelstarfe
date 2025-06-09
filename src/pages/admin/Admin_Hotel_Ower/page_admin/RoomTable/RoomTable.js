import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap";
import "../../../../../assets/css/admin/css/chart.css"; // Custom CSS
import { top5TypeRom } from "../Service/GetTokens";

const RoomTable = () => {
    const [selectedRoom, setSelectedRoom] = useState(null); // Trạng thái phòng đã chọn
    const [roomData, setRoomData] = useState([]); // Dữ liệu phòng
    const [selectedDateOption, setSelectedDateOption] = useState(
        parseInt(localStorage.getItem("selectedDateOption")) || 1 // Lấy giá trị từ localStorage hoặc mặc định là 1
    );
    const [error, setError] = useState(null); // Trạng thái lỗi

    useEffect(() => {
        const fetchInitialRoomData = async () => {
            setError(null); // Xóa lỗi cũ

            for (let i = 1; i <= dateOptions.length; i++) {
                try {
                    const response = await top5TypeRom(i); // Gọi API với từng tùy chọn
                    if (response && response.length > 0) {
                        setRoomData(response); // Lưu dữ liệu vào state
                        setSelectedDateOption(i); // Đặt tùy chọn hiện tại làm mặc định
                        localStorage.setItem("selectedDateOption", i); // Lưu vào localStorage
                        break; // Dừng vòng lặp khi tìm được dữ liệu
                    }
                } catch (error) {
                    console.error(`Error fetching data for date option ${i}`, error);
                }
            }
        };

        fetchInitialRoomData();
    }, []); // Chỉ chạy một lần khi component được render

    useEffect(() => {
        const fetchRoomData = async () => {
            setError(null); // Xóa lỗi cũ
            try {
                const response = await top5TypeRom(selectedDateOption); // Gọi API với tùy chọn người dùng chọn
                setRoomData(response || []); // Lưu dữ liệu vào state
            } catch (error) {
                console.error("Error fetching room data", error);
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            }
        };

        if (selectedDateOption) {
            fetchRoomData(); // Chỉ gọi khi `selectedDateOption` đã có giá trị
        }
    }, [selectedDateOption]); // Chạy khi `selectedDateOption` thay đổi

    const handleRowClick = (room) => {
        setSelectedRoom((prev) =>
            prev && prev.typeRoomId.id === room.typeRoomId.id ? null : room
        );
    };

    const handleDateChange = (event) => {
        const newDateOption = parseInt(event.target.value);
        setSelectedDateOption(newDateOption);
        localStorage.setItem("selectedDateOption", newDateOption); // Lưu vào localStorage
    };

    const dateOptions = [
        { value: 1, label: "Hôm nay" },
        { value: 2, label: "Hôm qua" },
        { value: 3, label: "7 ngày trước" },
        { value: 4, label: "Tháng hiện tại" },
        { value: 5, label: "Tháng trước" },
    ];
    

    return (
        <div className="container-fluid mt-4">
            <div className="card">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-6">
                            <h5 className="mb-0">Top 5 Hạng Phòng Theo Doanh Thu</h5>
                        </div>
                        <div className="col-6 text-end">
                            <select
                                className="form-select form-select-sm"
                                value={selectedDateOption}
                                onChange={handleDateChange}
                            >
                                {dateOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    {error ? (
                        <Alert variant="danger" className="text-center">
                            {error}
                        </Alert>
                    ) : roomData.length === 0 ? (
                        <Alert variant="warning" className="text-center">
                            <i className="bi bi-exclamation-triangle-fill"></i> Không có dữ liệu.
                        </Alert>
                    ) : (
                        <Table striped bordered hover responsive className="mb-0">
                            <thead className="table-secondary">
                                <tr>
                                    <th>#</th>
                                    <th>Tên phòng</th>
                                    <th>Loại phòng</th>
                                    <th>Doanh thu (VND)</th>
                                    <th>Tỷ lệ trên tổng doanh thu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roomData.map((room, index) => (
                                    <React.Fragment key={room.typeRoomId.id}>
                                        <tr className="cursor-pointer" onClick={() => handleRowClick(room)}>
                                            <td>{index + 1}</td>
                                            <td>{room.typeRoomName || "N/A"}</td>
                                            <td>{room.typeRoomId.typeRoomName || "N/A"}</td>
                                            <td>{room.revenue?.toLocaleString() || "N/A"}</td>
                                            <td>
                                                {room.revenuePercentage ? room.revenuePercentage.toFixed(2) : "N/A"} %
                                            </td>
                                        </tr>
                                        {selectedRoom && selectedRoom.typeRoomId.id === room.typeRoomId.id && (
                                            <tr>
                                                <td colSpan={5}>
                                                    <div className="mt-2">
                                                        <div className="card">
                                                            <div className="card-body p-3">
                                                                <div className="row g-3">
                                                                    {/* Room Images (4 columns) */}
                                                                    <div className="col-12 col-md-4">
                                                                        <div className="mb-2">
                                                                            <strong className="text-primary">Hình ảnh phòng:</strong>
                                                                            {room.typeRoomId.typeRoomImageDto && room.typeRoomId.typeRoomImageDto.length > 0 ? (
                                                                                <div className="d-flex flex-wrap">
                                                                                    {room.typeRoomId.typeRoomImageDto.map((image, index) => (
                                                                                        <img
                                                                                            key={index}
                                                                                            src={image.imageName}
                                                                                            alt={`Room Image ${index + 1}`}
                                                                                            className="img-thumbnail"
                                                                                            style={{ maxWidth: "90px", marginRight: "8px", marginBottom: "8px" }}
                                                                                        />
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                "N/A"
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Room Details (4 columns) */}
                                                                    <div className="col-12 col-md-4">
                                                                        <div className="mb-2">
                                                                            <strong className="text-primary">Thông tin phòng:</strong>
                                                                        </div>
                                                                        <div className="mb-1">
                                                                            <strong>Loại phòng:</strong> {room.typeRoomId.typeRoomName || "N/A"}
                                                                        </div>
                                                                        <div className="mb-1">
                                                                            <strong>Mô tả:</strong> {room.typeRoomId.describes || "N/A"}
                                                                        </div>
                                                                        <div className="mb-1">
                                                                            <strong>Giá phòng:</strong> {room.typeRoomId.price?.toLocaleString() || "N/A"} VND
                                                                        </div>
                                                                        <div className="mb-1">
                                                                            <strong>Số giường:</strong> {room.typeRoomId.bedCount || "N/A"}
                                                                        </div>
                                                                        <div className="mb-1">
                                                                            <strong>Diện tích (m²):</strong> {room.typeRoomId.acreage || "N/A"}
                                                                        </div>
                                                                        <div className="mb-1">
                                                                            <strong>Sức chứa:</strong> {room.typeRoomId.guestLimit || "N/A"}
                                                                        </div>
                                                                        <div className="mb-1">
                                                                            <strong>Loại giường:</strong> {room.typeRoomId.typeBedDto?.bedName || "N/A"}
                                                                        </div>
                                                                    </div>

                                                                    {/* Revenue Information (4 columns) */}
                                                                    <div className="col-12 col-md-4">
                                                                        <div className="mb-2">
                                                                            <strong className="text-primary">Thông tin doanh thu:</strong>
                                                                        </div>
                                                                        <div className="mb-1">
                                                                            <strong>Số lượt đặt:</strong> {room.bookingCount || "N/A"}
                                                                        </div>
                                                                        <div className="mb-1">
                                                                            <strong>Doanh thu trung bình mỗi lần đặt:</strong>
                                                                            {room.avgRevenuePerBooking?.toLocaleString() || "N/A"} VNĐ
                                                                        </div>
                                                                        <div className="mb-1">
                                                                            <strong>Giảm giá trung bình:</strong> {room.avgDiscountPercent || "N/A"} %
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomTable;
