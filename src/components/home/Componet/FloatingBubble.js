import React, { useState } from "react";
import "../../../assets/css/custom/Sticky.css";

const FloatingBubble = ({
    selectedRooms,
    handleRemoveRoom,
    calculateTotalPrice,
    loading,
    handleBooking,
}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const roomsPerPage = 2; // Số phòng mỗi trang

    // Tính toán các phòng cần hiển thị cho trang hiện tại
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = selectedRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    // Tổng số trang
    const totalPages = Math.ceil(selectedRooms.length / roomsPerPage);

    // Hàm chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Cập nhật lại khi xóa phòng
    const handleRemoveAndUpdatePagination = (roomId) => {
        handleRemoveRoom(roomId); // Xóa phòng

        // Kiểm tra số phòng còn lại và trang hiện tại
        const remainingRooms = selectedRooms.filter(room => room.roomId !== roomId);
        const remainingPages = Math.ceil(remainingRooms.length / roomsPerPage);

        // Nếu đang ở trang cuối mà đã xóa hết các phòng trên trang đó, chuyển về trang trước
        if (currentPage > remainingPages) {
            setCurrentPage(remainingPages); // Chuyển về trang cuối còn lại
        }

        // Nếu không còn phòng nào trên trang, chuyển về trang trước
        if (remainingRooms.length === 0) {
            setCurrentPage(1); // Chuyển về trang 1 nếu không còn phòng
        }
    };

    const handleBookingAndCloseModal = () => {
        // Gọi hàm đặt phòng
        handleBooking();
        const isChecked = false;
        localStorage.setItem("status", JSON.stringify(isChecked));
        setModalOpen(false);
    };

    return (
        <>
            {/* Bong bóng */}
            <div
                className="floating-bubble"
                onClick={() => setModalOpen(!isModalOpen)}
            >
                <i className="bi bi-door-open"></i>
                {selectedRooms.length > 0 && (
                    <div className="bubble-count">{selectedRooms.length}</div>
                )}
            </div>

            {/* Modal danh sách tóm tắt phòng */}
            {(currentRooms.length > 0 && !isModalOpen) && (
                <div className="selected-room-modal">
                    <h5>Phòng đã chọn:</h5>
                    <ul>
                        {currentRooms.map((room) => (
                            <li key={room.roomId}>
                                <div className="room-info">
                                    <span className="room-name">{room.roomName}</span>
                                    <span className="room-price">
                                        {room.price.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleRemoveAndUpdatePagination(room.roomId)}
                                    title="Xóa phòng"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    style={{
                                        padding: '3px 8px',
                                        fontSize: '14px',
                                        backgroundColor: '#FEA116',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s ease'
                                    }}
                                >
                                    <span aria-hidden="true" style={{ fontSize: '16px' }}>&laquo;</span>
                                </button>
                                <span style={{ fontSize: '14px', color: '#FEA116', fontWeight: 'bold' }}>
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        padding: '3px 8px',
                                        fontSize: '14px',
                                        backgroundColor: '#FEA116',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s ease'
                                    }}
                                >
                                    <span aria-hidden="true" style={{ fontSize: '16px' }}>&raquo;</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tổng tiền */}
                    <div className="total-price">
                        <span>Tổng tiền:</span>
                        <span>
                            {calculateTotalPrice().toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}
                        </span>
                    </div>

                    {/* Nút đặt phòng */}
                    <button
                        onClick={handleBookingAndCloseModal}  // Đặt phòng và đóng modal
                        className={`btn btn-primary booking-button ${loading ? "loading" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Đang đặt phòng..." : "Đặt phòng"}
                    </button>
                </div>
            )}
        </>
    );
};

export default FloatingBubble;
