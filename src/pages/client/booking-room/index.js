import React, { useEffect, useState } from 'react';
import LayoutClient from '../../../components/layout/cilent';
import './custom.css';
import { decodeToken } from '../../../services/client/Booking/BookingService';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingRoom, fetchDiscounts, getDataListTypeRoom } from './Service';
import Swal from 'sweetalert2';
import DiscountCodeSection from './Component/DiscountCodeSection';
import BookingInfo from './Component/BookingInfo';
const PageBookRoom = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [token, setToken] = useState({});
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [rooms, setRooms] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [roomIdss, setRoomId] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Số phòng hiển thị trên mỗi trang
    // State to store payment method and discount code
    const [paymentMethod, setPaymentMethod] = useState('');
    const location = useLocation();
    const [discounts, setDiscounts] = useState([]);
    const [discountName, setDiscountName] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log({
            fullName,
            email,
            phone,
        });
    };

    const handleDiscountName = (discount) => {
        console.log("Mã giảm giá đã chọn là: ", discount);
        setDiscountName(discount);
    }

    const getDataListRoomData = async (roomIdList) => {
        try {
            // Gọi API với chuỗi roomIdList
            const res = await getDataListTypeRoom(roomIdList);
            setSelectedRooms(res); // Lưu trữ kết quả vào state
        } catch (error) {
            console.log(error);
        }
    };


    const handleBookingRooms = async () => {
        try {
            // Lấy giá trị phone hiện tại
            const currentPhone = phone ? phone.trim() : "";

            if (!currentPhone) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Thông báo',
                    text: 'Bạn chưa nhập số điện thoại. Vui lòng cập nhật thông tin trước khi đặt phòng.',
                    confirmButtonText: 'Cập nhật ngay',
                    allowOutsideClick: false
                }).then(() => {
                    navigate('/client/profile'); // Chuyển hướng đến trang cập nhật số điện thoại
                });
                return; // Dừng hàm nếu không có số điện thoại hợp lệ
            }

            if (!paymentMethod) {
                await Swal.fire({
                    title: 'Phương thức thanh toán chưa được chọn!',
                    text: 'Vui lòng chọn phương thức thanh toán để tiếp tục.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return; // Dừng thực hiện nếu chưa chọn phương thức thanh toán
            }

            // Xử lý roomIdss
            let roomIdArray = [];
            if (Array.isArray(roomIdss)) {
                roomIdArray = [...roomIdss]; // Sao chép nếu là mảng
            } else {
                const roomIdNumber = parseInt(roomIdss); // Chuyển kiểu dữ liệu
                if (!isNaN(roomIdNumber)) {
                    roomIdArray.push(roomIdNumber); // Thêm vào mảng nếu hợp lệ
                } else {
                    console.error("roomIdss không hợp lệ:", roomIdss);
                }
            }
            const PAYMENT_METHODS = {
                POSTPAID: 1,
                ONLINE: 2,
            };

            const PaymentMethodId = paymentMethod === 'postpaid' ? PAYMENT_METHODS.POSTPAID : PAYMENT_METHODS.ONLINE;
            if (PaymentMethodId === PAYMENT_METHODS.ONLINE) {
                const result = await Swal.fire({
                    title: 'Chuyển đến cổng thanh toán VNPay',
                    text: 'Bạn sẽ được chuyển đến VNPay để hoàn tất thanh toán.',
                    icon: 'info',
                    confirmButtonText: 'Tiếp tục',
                    cancelButtonText: 'Hủy',
                    showCancelButton: true,
                    allowOutsideClick: false
                });

                // Người dùng hủy thanh toán
                if (!result.isConfirmed) {
                    console.log("Người dùng đã hủy thanh toán qua VNPay.");
                    return;
                }
            } else {
                const result = await Swal.fire({
                    title: 'Xác nhận đặt phòng',
                    text: 'Bạn đã chọn thanh toán khi trả phòng. Nhấn "Tiếp tục" để xác nhận đặt phòng.',
                    icon: 'info',
                    confirmButtonText: 'Tiếp tục',
                    cancelButtonText: 'Hủy',
                    showCancelButton: true,
                    allowOutsideClick: false
                });

                // Người dùng hủy thanh toán
                if (!result.isConfirmed) {
                    return;
                } else {
                    const isChecked = true;
                    localStorage.setItem("status", JSON.stringify(isChecked));
                    ["bookedRooms", "booking"].forEach(item => sessionStorage.removeItem(item));
                }
            }

            const finalDiscountName = discountName ? discountName?.discountName : "";

            // Tạo payload để gửi đi
            const payload = {
                userName: token.username ? token.username.toString() : "", // Đảm bảo username là chuỗi
                startDate: rooms.startDate, // Đảm bảo giá trị startDate hợp lệ
                endDate: rooms.endDate, // Đảm bảo giá trị endDate hợp lệ
                roomId: Array.isArray(roomIdArray) ? roomIdArray : [], // Kiểm tra roomIdArray có phải là mảng không
                discountName: finalDiscountName || null, // Sử dụng || để đảm bảo null nếu không có giá trị
                methodPayment: PaymentMethodId ? parseInt(PaymentMethodId) : null // Chuyển đổi PaymentMethodId thành số nguyên nếu hợp lệ
            };

            console.log("Payload trước khi gửi:", payload);

            // Gọi API đặt phòng
            await bookingRoom(payload, navigate);
        } catch (error) {
            console.error("Đặt phòng thất bại:", error);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get("status");
        const message = queryParams.get("message");
        const decodedMessage = decodeURIComponent(message || "");
        if (status === 'success' && message === 'Bạn đã đặt phòng thành công vui lòng vào email để xem chi tiết đơn đặt hàng và file pdf đã được lưu vào máy của quý khách') {
            console.log("Dữ liệu:", decodedMessage);
            console.log("Trạng thái: ", status);

            Swal.fire({
                icon: 'success',
                title: 'Đặt phòng thành công!',
                text: decodedMessage,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    ["bookedRooms", "booking"].forEach(item => sessionStorage.removeItem(item));
                    const isChecked = true;
                    localStorage.setItem("status", JSON.stringify(isChecked));
                    console.log("Thành công rồi nha");
                    navigate('/client/home');
                }
            });
        }
        if (status === 'error' && message === 'Thanh toán thất bại') {
            Swal.fire({
                icon: 'error',
                title: 'Đặt phòng không thành công!',
                text: decodedMessage,
                confirmButtonText: 'OK',
            })
        }
    }, [location.search, navigate]);

    useEffect(() => {
        // Giải mã token và lưu vào state
        const decode = decodeToken();
        console.log("Token đã được giả mã: ", decode);
        setToken(decode);
    }, []);

    useEffect(() => {
        if (token && token.phone) {
            setPhone(token.phone.trim());
        }
    }, [token]);

    useEffect(() => {
        const fetchBookedRooms = async () => {
            const roomsData = sessionStorage.getItem("bookedRooms");

            if (!roomsData) {
                console.warn('Không có dữ liệu trong sessionStorage với key "bookedRooms"');
                return;
            }

            try {
                // Giải mã dữ liệu chuỗi JSON thành mảng đối tượng
                const parsedRooms = JSON.parse(roomsData);

                // Kiểm tra nếu dữ liệu là mảng
                if (Array.isArray(parsedRooms)) {
                    // Lấy các roomId từ mảng phòng để gọi API
                    const roomIds = parsedRooms.map(room => room.roomId);
                    setRoomId(roomIds);
                    await getDataListRoomData(roomIds.join(',')); // Gọi API với danh sách roomId
                } else {
                    console.warn('Dữ liệu không phải là mảng.');
                }
            } catch (error) {
                console.error('Lỗi khi giải mã JSON:', error.message);
            }
        };

        fetchBookedRooms();
    }, []); // Chạy chỉ một lần khi component mount
    useEffect(() => {
        const bookingDataJSON = sessionStorage.getItem('booking'); // Lấy dữ liệu từ sessionStorage

        if (bookingDataJSON) {
            try {
                // Giải mã chuỗi JSON thành đối tượng JavaScript
                const bookingData = JSON.parse(bookingDataJSON);

                // Truy xuất các thuộc tính của đối tượng booking
                const { startDate, endDate, guestLimit } = bookingData;

                // Cập nhật state rooms với đối tượng chứa thông tin về booking
                setRooms({ startDate, endDate, guestLimit });
            } catch (error) {
                console.error('Lỗi khi giải mã booking:', error.message);
            }
        } else {
            console.warn('Không có dữ liệu booking trong sessionStorage');
        }
    }, []);


    // Function to calculate the total price with discount applied
    const calculateTotalPrice = () => {
        let total = selectedRooms.reduce((acc, item) => acc + item.price, 0);
        setTotalPrice(total);
    };

    // Update total price whenever selectedRooms or discount changes
    useEffect(() => {
        calculateTotalPrice();
    }, [selectedRooms, discountName]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRooms = selectedRooms.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(selectedRooms.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    //kiểm tra người dùng khi chưa đặt phòng
    useEffect(() => {
        try {
            const status = localStorage.getItem("status");

            if (status && JSON.parse(status) === true) {
                navigate("/client/rooms");
            } else {
                navigate("/client/booking-room");
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái đặt phòng:", error);
            navigate("/client/rooms");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchDiscountsFromAPI = async (userName) => {
            try {
                const res = await fetchDiscounts(userName);  // Assuming fetchDiscounts is a defined function
                setDiscounts(res);
            } catch (error) {
                console.log("Error fetching data from API: ", error);
            }
        };

        if (token.username) {  // Check if token.username exists
            fetchDiscountsFromAPI(token.username);
        }
    }, [token.username]);  // Add token.username as a dependency


    const handleCancel = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Hủy đặt phòng?',
            text: 'Bạn có chắc chắn muốn hủy đặt phòng không? Dữ liệu sẽ bị xóa.',
            showCancelButton: true,
            confirmButtonColor: '#ffc107', // Màu nút xác nhận (phù hợp màu chủ đạo)
            cancelButtonColor: '#d33', // Màu nút Hủy
            confirmButtonText: 'Hủy đặt phòng',
            cancelButtonText: 'Quay lại',
        }).then((result) => {
            if (result.isConfirmed) {
                // Xóa toàn bộ dữ liệu trong sessionStorage
                ["bookedRooms", "booking"].forEach(item => sessionStorage.removeItem(item));
                const isChecked = true;
                localStorage.setItem("status", JSON.stringify(isChecked));
                // Điều hướng về trang phòng
                navigate("/client/rooms");
            }
        });
    }
    return (
        <LayoutClient>
            <div className="page-box-content page-hotel">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <h3 className="booking-title">Thông tin đặt phòng</h3>
                            <div className="box-content mb-5">
                                <form id="form-hotel-booking" className="create-booking" onSubmit={handleSubmit} noValidate>
                                    <div className="d-flex justify-content-start align-items-center mb-3">
                                        <button
                                            type="button"
                                            className="btn-sm d-flex align-items-center btn-back"
                                            onClick={() => window.history.back()}
                                            style={{
                                                borderRadius: "50%",
                                                justifyContent: "center",
                                                background: "#ffc107", // Màu nền theo chủ đạo
                                                border: "none",
                                                width: "40px",
                                                height: "40px",
                                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Thêm chút bóng
                                                cursor: "pointer",
                                            }}
                                        >
                                            <i className="bi bi-arrow-left text-white" style={{ fontSize: "18px" }}></i>
                                        </button>
                                    </div>

                                    {/* Thông tin khách hàng */}
                                    <div className="form-row">
                                        <div className="col-lg-12 col-md-12">
                                            <label htmlFor="txt_fullname" className="custom-form-label">Họ và tên <span className="required">*</span></label>
                                            <input
                                                id="txt_fullname"
                                                value={token.fullname}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                                type="text"
                                                className="custom-form-control"
                                                name="txt_fullname"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col-lg-6 col-md-6">
                                            <label htmlFor="txt_email" className="custom-form-label">Email <span className="required">*</span></label>
                                            <input
                                                id="txt_email"
                                                value={token.email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                type="email"
                                                className="custom-form-control"
                                                name="txt_email"
                                                disabled
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <label htmlFor="txt_phone" className="custom-form-label">Số điện thoại <span className="required">*</span></label>
                                            <input
                                                id="txt_phone"
                                                value={token.phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                                type="text"
                                                className="custom-form-control"
                                                name="txt_phone"
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {/* Danh sách phòng đã chọn */}
                                    <ul id="selected_rooms" className="list-group">
                                        {currentRooms.map((room, index) => (
                                            <li
                                                key={index}
                                                className="room-items"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: '10px',
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                {/* Hình ảnh phòng */}
                                                <div style={{ flex: '1', maxWidth: '100px', marginRight: '15px' }}>
                                                    <img
                                                        src={room.listImageName[0]} // Lấy tấm hình đầu tiên từ danh sách
                                                        alt={`${room.roomName}`}
                                                        style={{ width: '100%', borderRadius: '5px', height: '65px' }}
                                                    />
                                                </div>
                                                {/* Thông tin phòng */}
                                                <div style={{ flex: '2' }}>
                                                    <span
                                                        className="room-name"
                                                        style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#333' }}
                                                    >
                                                        {`${room.roomName}: ${room.typeRoomName}`}
                                                    </span>
                                                    <div
                                                        className="room-price"
                                                        style={{
                                                            marginTop: '5px',
                                                            fontSize: '1.1em',
                                                            fontWeight: 'bold',
                                                            color: '#feaf39',
                                                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                                                        }}
                                                    >
                                                        {(() => {
                                                            // Lấy dữ liệu valueFillter từ sessionStorage
                                                            const valueFillter = JSON.parse(sessionStorage.getItem("valueFillter"));

                                                            if (!valueFillter) {
                                                                return "Giá: Không có dữ liệu"; // Nếu không có dữ liệu từ sessionStorage
                                                            }

                                                            // Lấy ngày checkIn và checkOut từ valueFillter
                                                            const checkinDate = new Date(valueFillter.checkIn);
                                                            const checkoutDate = new Date(valueFillter.checkOut);

                                                            // Tính số ngày giữa checkIn và checkOut
                                                            const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24);

                                                            // Tính giá phòng cho số ngày đã chọn
                                                            const totalPrice = room.price * nights;

                                                            return `Giá: ${totalPrice.toLocaleString()} VND cho ${nights} ngày`;
                                                        })()}
                                                    </div>
                                                    <div
                                                        className="guest-limit"
                                                        style={{ marginTop: '5px' }}
                                                    >
                                                        <span
                                                            className="badge"
                                                            style={{
                                                                backgroundColor: '#feaf39',
                                                                color: '#fff',
                                                                padding: '5px 10px',
                                                                borderRadius: '15px'
                                                            }}
                                                        >
                                                            {`Tối đa ${room.guestLimit} người`}
                                                        </span>
                                                    </div>
                                                </div>

                                            </li>
                                        ))}
                                    </ul>

                                    <div className="pagination">
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(index + 1)}
                                                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                                style={{
                                                    padding: '10px 15px',
                                                    margin: '0 5px',
                                                    backgroundColor: currentPage === index + 1 ? '#feaf39' : '#f1f1f1',
                                                    color: currentPage === index + 1 ? '#fff' : '#333',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="row mt-2">
                                        {/* Phần mã giảm giá */}
                                        <DiscountCodeSection discounts={discounts} discountNameTotal={handleDiscountName} />

                                        {/* Phần phương thức thanh toán */}
                                        <div className="col-12 mt-2">
                                            <div className="payment-methods" style={{ padding: '15px', borderRadius: '8px' }}>
                                                <h4>Chọn phương thức thanh toán</h4>
                                                <div className="payment-options d-flex justify-content-between mt-3">
                                                    {/* Phương thức thanh toán trả sau */}
                                                    <div
                                                        className="payment-option card"
                                                        style={{
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            border: '1px solid #ddd',
                                                            textAlign: 'center',
                                                            width: '48%',
                                                            backgroundColor: paymentMethod === 'postpaid' ? '#FFCC00' : 'transparent',
                                                            color: paymentMethod === 'postpaid' ? 'white' : '#333',
                                                            boxShadow: paymentMethod === 'postpaid' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s ease',
                                                        }}
                                                        onClick={() => setPaymentMethod('postpaid')}
                                                    >
                                                        <div className="payment-icon" style={{ fontSize: '1.5em' }}>🛏️</div>
                                                        <p className="payment-label" style={{ fontWeight: 'bold', marginTop: '5px' }}>Thanh toán khi trả phòng</p>
                                                    </div>

                                                    {/* Phương thức thanh toán Online */}
                                                    <div
                                                        className="payment-option card"
                                                        style={{
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            border: '1px solid #ddd',
                                                            textAlign: 'center',
                                                            width: '48%',
                                                            backgroundColor: paymentMethod === 'online' ? '#FFCC00' : 'transparent',
                                                            color: paymentMethod === 'online' ? 'white' : '#333',
                                                            boxShadow: paymentMethod === 'online' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s ease',
                                                        }}
                                                        onClick={() => setPaymentMethod('online')}
                                                    >
                                                        <div className="payment-icon" style={{ fontSize: '1.5em' }}>💳</div>
                                                        <p className="payment-label" style={{ fontWeight: 'bold', marginTop: '5px' }}>Thanh toán Online (VNPay)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nút Submit */}
                                    <div className="box-submit mt-4">
                                        {/* Phần Nút Quay lại */}
                                        <div className="back-button">
                                            <button
                                                type="button"
                                                className="custom-back-btn"
                                                onClick={handleCancel} // Quay lại trang trước
                                            >
                                                Hủy
                                            </button>
                                        </div>

                                        {/* Phần Nút Xác nhận */}
                                        <div className="submit-button">
                                            <button
                                                type="button"
                                                className="custom-submit-btn"
                                                onClick={handleBookingRooms}
                                            >
                                                Xác nhận
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                        <BookingInfo
                            token={token}
                            rooms={rooms}
                            selectedRooms={selectedRooms}
                            totalPrice={totalPrice}
                            discount={discountName}
                        />
                    </div>
                </div >
            </div >
        </LayoutClient >
    )
}

export default PageBookRoom;