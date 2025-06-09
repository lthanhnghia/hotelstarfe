import React, { useState, useEffect, useRef } from "react";
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RecentlyViewed.css';
import Cookies from "js-cookie";
import { jwtDecode as jwt_decode } from "jwt-decode";
import HistoryBookings from "./callApi";
import postFeedBack from "./postFeedBackApi";
import Alert from "../../../../config/alert";
import { useNavigate } from 'react-router-dom';
import deleteBooking from "./deleteBooking";
import Swal from "sweetalert2";
const RecentlyViewed = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const roomsPerPage = 2;
    const [rating, setRating] = useState(0); // Để lưu sao đánh giá của người dùng
    const [review, setReview] = useState(""); // Để lưu nội dung đánh giá
    const [descriptions, setDescriptions] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [mockBookings, setMockBookings] = useState([]);
    const navigate = useNavigate();
    const [alertData, setAlertData] = useState(null);
    // Lấy token từ cookies và decode
    const intervalRef = useRef(null);
    const tokens = Cookies.get("token") || null;
    const decodedToken = tokens ? jwt_decode(tokens) : null;

    useEffect(() => {
        const fetchBookings = async () => {
            if (!decodedToken?.id) {
                console.error("Invalid token or missing account ID.");
                setMockBookings([]);
                return;
            }

            try {
                // Gọi API lấy lịch sử đặt phòng
                console.log("ID:", decodedToken.id);
                const response = await HistoryBookings(decodedToken.id);
                console.log("API response:", response);

                // Kiểm tra nếu API trả về mảng, lưu vào state
                if (Array.isArray(response)) {
                    setMockBookings(response);
                } else {
                    console.error("API response is not an array:", response);
                    setMockBookings([]);
                }
            } catch (error) {
                console.error("Error fetching booking history:", error);
                setMockBookings([]);
            }
        };
        // Cleanup interval nếu decodedToken thay đổi
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Gọi API ngay lần đầu
        if (decodedToken?.id) {
            fetchBookings();
            // Thiết lập interval gọi API mỗi 15 giây
            intervalRef.current = setInterval(() => {
                console.log("Gọi API sau 15 giây...");
                fetchBookings();
            }, 15000); // 15 giây
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [decodedToken?.id]);

    // Xử lý khi người dùng đổi trang
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    // Lấy các mục hiển thị trên trang hiện tại
    const currentRooms = Array.isArray(mockBookings)
        ? mockBookings.slice(
            currentPage * roomsPerPage,
            (currentPage + 1) * roomsPerPage
        )
        : [];

    // Xử lý sự kiện khi người dùng đánh giá sao
    const handleRatingClick = (stars) => {
        setRating(stars);
    };

    // Xử lý sự kiện khi người dùng nhập đánh giá
    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    const handleDescriptionsChange = (event) => {
        setDescriptions(event.target.value);
    };
    const handleSubmitReview = async (invoiceIds) => {
        const reviewData = {
            idInvoice: invoiceIds,
            stars: rating,
            content: review,
        };

        const result = await Swal.fire({
            title: "Bạn đã xác nhận sẽ đánh giá ?",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "OK",
        });

        if (result.isConfirmed) {
            try {
                const response = await postFeedBack(reviewData);
                console.log("API response:", response);

                if (response.code == "201") {
                    setAlertData({ type: response.status, title: response.message });
                    setTimeout(() => {
                        window.location.href = "http://localhost:3000/client/profile";
                    }, 1700);
                } else {
                    setAlertData({ type: response.status, title: response.message });
                    navigate("/client/profile");
                }
            } catch (error) {
                console.error("Error fetching booking history:", error);
            }
        }
    };
    const handleSubmitDeleteBooking = async (bookingIds) => {

        const bookingData = {
            bookingId: bookingIds, // Lấy từ booking
            descriptions: descriptions // Nội dung đánh giá
        };
        const result = await Swal.fire({
            html: `<p style="font-size: 17px; font-family: Arial, sans-serif; color: #333;">
                      Bạn có chắc chắn muốn hủy đơn đặt phòng này? 
                      <br>Hãy cân nhắc kỹ trước khi quyết định nhé.
                  </p>`,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "OK",
        });

        if (result.isConfirmed) {
            try {
                // Gọi API lấy lịch sử đặt phòng
                const response = await deleteBooking(bookingData);
                console.log("API response:", response);

                // Kiểm tra nếu API trả về mảng, lưu vào state
                if (response.code == "201") {
                    setAlertData({ type: response.status, title: response.message });
                    setTimeout(() => {
                        window.location.href = "http://localhost:3000/client/profile";
                    }, 1700);
                } else {
                    setAlertData({ type: response.status, title: response.message });
                    navigate('/client/profile');
                }
            } catch (error) {
                console.error("Error fetching booking delete:", error);
            }
        }


    };
    return (
        <div className="container mt-3">
            <h2 className="text-center text-warning mb-4">Lịch sử đặt phòng</h2>
            <div className="row mt-3">
                {currentRooms.map((booking) => (
                    <div key={booking.id} className="col-md-12 col-sm-12 mb-4">
                        <div className="card shadow-sm d-flex flex-row"> {/* Horizontal Layout */}
                            {/* Image Section */}
                            <img
                                src={booking.image}
                                className="card-img-left"
                                alt={booking.fullname}
                                style={{ width: "50%", objectFit: "cover" }} // Adjust image width
                            />

                            {/* Card Body Section */}
                            <div className="card-body" style={{
                                paddingLeft: '30px', // Điều chỉnh padding nếu cần
                                width: 'auto',   // Đặt width tự động
                                overflow: 'hidden' // Ẩn phần thừa nếu cần
                            }}>
                                <h5 className="card-title">{booking.bkFormat}</h5>
                                <p className="card-text">
                                    <strong>Nhận phòng:</strong> {booking.startAt} 14:00
                                </p>
                                <p className="card-text">
                                    <strong>Trả phòng:</strong> {booking.endAt} 12:00
                                </p>
                                <p className="card-text">
                                    <strong>Trạng thái đặt phòng:</strong> {booking.statusBkName}
                                </p>
                                <p className="custom-price-text">
                                    <strong>Tổng giá:</strong> {booking.totalBooking ? booking.totalBooking.toLocaleString() : "0"} VND
                                </p>

                                <div className="text-start">

                                    {booking.ivId && (
                                        <button
                                            className="btn btn-primary  btn-sm"
                                            data-bs-toggle="modal"
                                            data-bs-target={`#reviewModal-${booking.bkId}`}
                                            disabled={booking.fbId !== null}
                                        >
                                            Đánh giá {console.log(booking)}
                                        </button>
                                    )}

                                    <button
                                        className="btn btn-primary ms-1 btn-sm"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#detailModal-${booking.bkId}`}
                                    >
                                        Chi tiết
                                    </button>
                                    <button
                                        className="btn btn-primary ms-1 btn-sm"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#detailViewFeedbackModal-${booking.bkId}`}
                                        disabled={booking.fbId == null}
                                    >
                                        xem Đánh giá
                                    </button>

                                    {(booking.statusBookingID === 1 || booking.statusBookingID === 2) && (
                                        <button
                                            className="btn btn-primary ms-1  btn-sm"
                                            data-bs-toggle="modal"
                                            data-bs-target={`#deleteBookingModal-${booking.bkId}`}
                                        >
                                            Hủy
                                        </button>
                                    )}
    
                                </div>
                            </div>
                        </div>

                        {/* Modal Chi Tiết */}
                        <div
                            className="modal fade"
                            id={`detailModal-${booking.bkId}`}
                            tabIndex="-1"
                            aria-labelledby={`detailModalLabel-${booking.bkId}`}
                            aria-hidden="true"
                        >
                            <div className="modal-dialog modal-sm">
                                <div className="modal-content">
                                    {/* Modal Header */}
                                    <div className="modal-headers modal-header">
                                        <h5 className="modal-title" id={`detailModalLabel-${booking.bkId}`}>
                                            Chi Tiết Phòng
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="modal-body" style={{ padding: '15px' }}>
                                        <div className="container">
                                            {/* Row 1: Thông tin phòng */}
                                            <div className="row mb-4">
                                                <div className="col-md-5">
                                                    <h5>Thông tin đặt phòng</h5>
                                                    <p><strong>Mã Đặt Phòng:</strong> {booking.bkFormat}</p>
                                                    <p><strong>Ngày đặt:</strong> {booking.createAt} </p>
                                                    <p><strong>Nhận phòng:</strong> {booking.startAt} 14:00</p>
                                                    <p><strong>Trả phòng:</strong> {booking.endAt} 12:00</p>
                                                    <p><strong>Thanh toán:</strong> {booking.methodPaymentName} </p>
                                                    <p><strong>Trạng thái đặt phòng:</strong> <span style={{ color: '#FEA116' }}>{booking.statusBkName}</span></p>
                                                </div>
                                                <div className="col-md-1"></div>
                                                <div className="col-md-6">
                                                    <h5>Chi tiết phòng</h5>
                                                    <p style={{ whiteSpace: 'normal' }}><strong>Phòng:</strong> {booking.roomInfo}</p>
                                                    <p><strong>Tiền Phòng:</strong>  {booking.totalRoom ? booking.totalRoom.toLocaleString() : "0"} VND </p>
                                                    <p><strong>Dịch vụ:</strong> {booking.combinedServiceNames || "Chưa sử dụng dịch vụ"}</p>
                                                    <p><strong>Tiền Dịch Vụ:</strong> {booking.combinedTotalServices ? booking.combinedTotalServices.toLocaleString() : "0"} VND</p>
                                                    <p><strong>Giảm giá:</strong> Đã giảm giá 10%</p>
                                                    <strong>Tổng giá:</strong> <span style={{ color: '#E60000 ' }}>{booking.totalBooking ? booking.totalBooking.toLocaleString() : "0"} VND</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="modal-footers modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Đánh Giá */}
                        <div className="modal fade" id={`reviewModal-${booking.bkId}`} tabIndex="-1" aria-labelledby={`reviewModalLabel-${booking.bkId}`} aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-headers modal-header">
                                        <h5 className="modal-title" id={`reviewModalLabel-${booking.bkId}`}>Đánh Giá Phòng</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* Avatar và Tên người dùng */}
                                        <div className="d-flex align-items-center mb-3">
                                            <img src={booking.avatar} alt={booking.fullname} className="rounded-circle" style={{ width: "50px", height: "50px", marginRight: "10px" }} />
                                            <div>
                                                <h6>{booking.username}</h6>
                                                <p>Mã đặt phòng: <strong>{booking.bkFormat}</strong></p>
                                            </div>
                                        </div>

                                        {/* Sao đánh giá */}
                                        <div>
                                            <h6>Đánh giá sao:</h6>
                                            <div>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        onClick={() => handleRatingClick(star)}
                                                        style={{ fontSize: '30px', width: '40px', height: '40px', padding: 0, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                                                    >
                                                        {/* Dùng ký tự sao Unicode */}
                                                        <span className={`star ${rating >= star || hoveredRating >= star ? 'filled' : ''}`}>&#9733;</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>


                                        {/* Nội dung đánh giá */}
                                        <div className="mt-3">
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                value={review}
                                                onChange={handleReviewChange}
                                                placeholder="Nhập nội dung đánh giá..."
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footers modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                        <button type="button" className="btn btn-primary" onClick={() => handleSubmitReview(booking.ivId)}>Gửi đánh giá</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal xem Đánh Giá */}
                        <div className="modal fade" id={`detailViewFeedbackModal-${booking.bkId}`} tabIndex="-1" aria-labelledby={`detailViewFeedbackModalLabel-${booking.bkId}`} aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-headers modal-header">
                                        <h5 className="modal-title" id={`detailViewFeedbackModalLabel-${booking.bkId}`}>Đánh Giá Phòng</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* Avatar và Tên người dùng */}
                                        <div className="d-flex align-items-center mb-3">
                                            <img src={booking.avatar} alt={booking.fullname} className="rounded-circle" style={{ width: "50px", height: "50px", marginRight: "10px" }} />
                                            <div>
                                                <h6>{booking.fullname}</h6>
                                                <p>Mã đặt phòng: <strong>{booking.bkFormat}</strong></p>
                                            </div>
                                        </div>

                                        {/* Sao đánh giá */}
                                        <div>
                                            <h6>Đánh giá sao:</h6>
                                            <div>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        onClick={() => handleRatingClick(star)}
                                                        style={{ fontSize: '30px', width: '40px', height: '40px', padding: 0, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                                                    >
                                                        {/* Dùng ký tự sao Unicode */}
                                                        <span className={`star ${booking.stars >= star ? 'filled' : ''}`}>&#9733;</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>


                                        {/* Nội dung đánh giá */}
                                        <div className="mt-3">
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                value={booking.content}
                                                onChange={handleReviewChange}
                                                placeholder="Nhập nội dung đánh giá..."
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footers modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Modal hủy đặt phòng */}
                        <div className="modal fade" id={`deleteBookingModal-${booking.bkId}`} tabIndex="-1" aria-labelledby={`deleteBookingModalLabel-${booking.bkId}`} aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-headers modal-header">
                                        <h5 className="modal-title" id={`deleteBookingModalLabel-${booking.bkId}`}>Đánh Giá Phòng</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* Avatar và Tên người dùng */}
                                        <div className="d-flex align-items-center mb-3">
                                            <img src={booking.avatar} alt={booking.fullname} className="rounded-circle" style={{ width: "50px", height: "50px", marginRight: "10px" }} />
                                            <div>
                                                <h6>{booking.fullname}</h6>
                                                <p>Mã đặt phòng: <strong>{booking.bkFormat}</strong></p>
                                            </div>
                                        </div>

                                        {/* Sao đánh giá */}
                                        <div>
                                            <h6>Lý do hủy:</h6>

                                        </div>
                                        {/* Nội dung đánh giá */}
                                        <div className="mt-3">
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                onChange={handleDescriptionsChange}
                                                placeholder="Nhập nội dung hủy..."
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footers modal-footer">
                                        <button type="button" className="btn btn-primary" onClick={() => handleSubmitDeleteBooking(booking.bkId)}>Hủy đặt phòng</button>
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Phân trang */}
            <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                    previousLabel={"← Trước"}
                    nextLabel={"Tiếp →"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(mockBookings.length / roomsPerPage)}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center"} // Sử dụng Bootstrap class
                    activeClassName={"active"} // Bootstrap đã có style cho active
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    nextClassName="page-item"
                    previousLinkClassName="page-link"
                    nextLinkClassName="page-link"
                />
            </div>
            {alertData && <Alert type={alertData.type} title={alertData.title} />}
        </div>
    );
};

export default RecentlyViewed;
