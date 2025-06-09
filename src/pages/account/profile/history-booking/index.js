import React from "react";

const HistoryBooking = () => {
    return (
        <div>
            <h3>Lịch sử hóa đơn</h3>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card mb-3">
                            <div className="card-header">
                                <strong>Mã hóa đơn: #HD001</strong>
                            </div>
                            <div className="card-body">
                                <p className="card-text">Ngày tạo: 2024-09-15</p>
                                <p className="card-text">Mã đặt phòng: #DP001</p>
                                <p className="card-text">Tổng tiền: 3,000,000 VND</p>
                                <p className="card-text">Trạng thái: <span className="badge bg-success">Hoàn thành</span></p>
                            </div>
                            <div className="card-footer text-end">
                                <button style={{ background: "#dfa974" }} className="btn" data-bs-toggle="modal" data-bs-target="#bookingDetailModal">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="bookingDetailModal" tabindex="-1" aria-labelledby="bookingDetailModalLabel"
                        aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="bookingDetailModalLabel">Chi tiết đặt phòng</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Mã hóa đơn:</strong> #HD001</p>
                                    <p><strong>Ngày tạo:</strong> 2024-09-15</p>
                                    <p><strong>Mã đặt phòng:</strong> #DP001</p>
                                    <p><strong>Tổng tiền:</strong> 3,000,000 VND</p>
                                    <p><strong>Trạng thái:</strong> Hoàn thành</p>
                                    <hr />
                                    <p><strong>Thông tin khách sạn:</strong> Khách sạn ABC</p>
                                    <p><strong>Thời gian lưu trú:</strong> 2024-09-20 đến 2024-09-23</p>
                                    <p><strong>Số lượng phòng:</strong> 2</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HistoryBooking;