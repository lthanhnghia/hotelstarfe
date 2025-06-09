import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
    FaWifi,
    FaTv,
    FaRegSnowflake,
    FaTshirt,
    FaConciergeBell,
    FaCoffee,
    FaTaxi,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
// import "../../assets/css/custom/Sticky.css";
import "../../../assets/css/custom/Filter.css";
import "../../../assets/css/custom/cardBorder.css";
import { Cookies } from 'react-cookie';
import Swal from 'sweetalert2';
import { getDetailListTypeRoom, getFilterBooking, getListRoom } from "../../../services/client/home";
import Alert from "../../../config/alert";
import BookingFillter from "../../account/Filter/FilterBooking";
import { ListRooms } from "../../../components/home/Componet/ListRooms";
import FloatingBubble from "../../../components/home/Componet/FloatingBubble";
import RoomDetail from "../../client/Room/modal-room/RoomDetail";
import Layoutemployee from "../../../components/layout/employee";
import { cilSpreadsheet, flagSet } from "@coreui/icons";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { addBookingOffline } from "../../../services/employee/orderRoom";
import InsertCustomer from "../list-reservation/modalInsertCustomer";
import { getBookingId } from "../../../services/employee/booking-manager";
import AlertComfirm from "../../../config/alert/comfirm";
import CancelBookingModal from "../list-reservation/modalCancel";

const amenityIcons = {
    "WiFi": <FaWifi style={{ color: "#FEA116" }} />,
    "Điều Hoà": <FaRegSnowflake style={{ color: "#FEA116" }} />,
    "TV": <FaTv style={{ color: "#FEA116" }} />,
    "Mini Bar": <FaTshirt style={{ color: "#FEA116" }} />,
    "Dịch Vụ Phòng": <FaConciergeBell style={{ color: "#FEA116" }} />,
    "Bữa sáng miễn phí": <FaCoffee style={{ color: "#FEA116" }} />,
    "Giặt ủi": <FaTshirt style={{ color: "#FEA116" }} />,
    "Đưa Đón": <FaTaxi style={{ color: "#FEA116" }} />
};

export default function ListRoomEmployee() {
    const [showModal, setShowModal] = useState(false);
    const [showModalCustomer, setShowModalCustomer] = useState(false);
    const [booking, setBooking] = useState({});
    const [roomItem, setRoomItem] = useState([]);
    const [modalCancel, setModalCancel] = useState(false);
    const [typeRoom, setTypeRoom] = useState([]);
    const [alert, setAlert] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const [totalPages, setTotalPages] = useState(1); // Total pages state
    const pageSize = 4;
    const [selectedRooms, setSelectedRooms] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dataFilterBook, setDataFilterBook] = useState({
        startDate: '', endDate: '', guestLimit: ''
    });
    const [dates, setDates] = useState({});
    // Định nghĩa state phân trang
    const roomsPerPage = 3; // Số lượng phòng trên mỗi trang
    const [currentPageIndex, setCurrentPageIndex] = useState(1); // Trang hiện tại
    const location = useLocation();
    const cookies = new Cookies();
    const token = cookies.get('token');
    // Hàm gọi API danh sách phòng
    const fetchRooms = async () => {
        try {
            const res = await getListRoom(currentPage, pageSize); // Lấy phòng dựa trên trang hiện tại
            setTypeRoom(res.content);
            setTotalPages(res.totalPages); // Tổng số trang từ API
        } catch (error) {
            console.log("Lỗi API trả về: ", error);
        }
    };


    // Effect để gọi API khi trang thay đổi
    useEffect(() => {
        console.log(booking);

        if (dataFilterBook.startDate || dataFilterBook.endDate || dataFilterBook.guestLimit) {
            filterBooking(dataFilterBook.startDate, dataFilterBook.endDate, dataFilterBook.guestLimit, currentPage, pageSize);
        } else {
            fetchRooms();
        }
    }, [currentPage, dataFilterBook, booking]); // Khi currentPage hoặc dataFilterBook thay đổi, sẽ gọi lại API tương ứng

    // Fetch room details
    const getDataDetail = async (id) => {
        try {
            const res = await getDetailListTypeRoom(id);
            if (res) {
                setRoomItem(res[0]);
                setShowModal(true);
            } else {
                setAlert({ type: "error", title: "Không tìm thấy chi tiết phòng." });
            }
        } catch (error) {
            setAlert({ type: "error", title: error.message });
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSelectRoom = ({ Object, roomId }) => {

        console.log("Dữ liệu item: ", Object);  // Kiểm tra dữ liệu item
        console.log("Dữ liệu roomId: ", roomId);  // Kiểm tra roomId

        // Kiểm tra người dùng đã đăng nhập chưa
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Yêu cầu đăng nhập',
                text: 'Bạn cần đăng nhập để thực hiện chức năng đặt phòng.',
                confirmButtonText: 'Đăng nhập ngay',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/account"); // Chuyển hướng đến trang đăng nhập
                }
            });
            return; // Ngừng hàm nếu chưa đăng nhập
        }
        // Kiểm tra xem người dùng đã chọn thời gian chưa
        if (!dates.checkin || !dates.checkout) {
            // Nếu chưa chọn thời gian, tự động kích hoạt bộ lọc
            Swal.fire({
                icon: 'info',
                title: 'Chọn thời gian',
                text: 'Vui lòng chọn thời gian trước khi chọn phòng!',
                confirmButtonText: 'OK',
            })

            return; // Ngừng hàm cho đến khi người dùng chọn thời gian
        }
        // Tìm đối tượng phòng dựa trên roomId
        const selectedRoomIndex = Object.roomId.indexOf(roomId);

        if (selectedRoomIndex === -1) {
            console.log("Không tìm thấy phòng với roomId:", roomId);
            return; // Ngừng nếu không tìm thấy phòng
        }

        // Lấy thông tin phòng
        const roomDetails = {
            roomId: roomId,
            roomName: Object.roomName[selectedRoomIndex],
            price: Object.price,
            typeRoomName: Object.typeRoomName,
            description: Object.description,
            imageList: Object.imageList,
        };

        console.log("Thông tin phòng đã chọn: ", roomDetails);

        // Cập nhật danh sách phòng đã chọn
        setSelectedRooms((prev) => {
            // Kiểm tra nếu phòng đã được chọn thì loại bỏ, nếu chưa thì thêm vào
            if (prev.some((r) => r.roomId === roomDetails.roomId)) {
                return prev.filter((r) => r.roomId !== roomDetails.roomId); // Loại bỏ phòng nếu đã chọn
            }
            return [...prev, roomDetails]; // Thêm phòng mới vào danh sách
        });
    };

    const handleRemoveRoom = (roomId) => {
        setSelectedRooms((prev) => {
            const updatedRooms = prev.filter((room) => room.roomId !== roomId);
            // Kiểm tra nếu số phòng còn lại không đủ cho trang hiện tại, chuyển về trang đầu tiên
            if (updatedRooms.length <= (currentPageIndex - 1) * roomsPerPage) {
                setCurrentPageIndex(1); // Chuyển về trang đầu tiên
            }
            return updatedRooms;
        });
    };


    const saveArrayToSession = (key, array) => {
        const jsonString = JSON.stringify(array); // Chuyển mảng thành chuỗi JSON
        sessionStorage.setItem(key, jsonString); // Lưu vào sessionStorage
    };

    // Hàm tính tổng tiền sau khi giảm giá
    const calculateTotalPrice = () => {
        const total = selectedRooms.reduce((total, room) => total + room.price, 0);
        return total;
    };

    // Hàm xử lý đặt phòng
    const handleBooking = async () => {
        const decodedToken = token ? jwt_decode(token) : null;
        if (selectedRooms.length > 0 && decodedToken) {
            const roomId = selectedRooms.map(room => room.roomId);
            const orderData = {
                userName: decodedToken.username,
                startDate: dates.checkin,
                endDate: dates.checkout,
                roomId: roomId
            }
            const response = await addBookingOffline(orderData);
            if (response?.status) {
                setAlert({ type: response.status, title: response.message });
            } else if (response !== null) {
                setAlert({ type: "success", title: "Đặt phòng thành công" });
                const booking = await getBookingId(response.id);
                setBooking(booking);
                setShowModalCustomer(true);
                // navigate("/employee/list-booking-room");
            } else {
                setAlert({ type: "error", title: "Đặt phòng thất bại" });
            }

            // Reset danh sách phòng
            setSelectedRooms([]);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Yêu cầu chọn phòng',
                text: 'Vui lòng chọn phòng trước khi đặt!',
                confirmButtonText: 'Oke',
            });

            console.log("Vui lòng chọn phòng trước khi đặt!");
        }
    };
    const handleCloseCancel = () => {
        setModalCancel(false);
    }

    const handleCancelBooking = async () => {
        setModalCancel(true);
    }

    const handleLoseModalCustomer = async () => {
        const confirmation = await AlertComfirm.confirm({
            type: "warning",
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn hủy đặt phòng này không?",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Bỏ qua",
        });
        if (confirmation) {
            handleCancelBooking();
        }
    }

    const handleSaveModalCustomer = () => {
        setShowModalCustomer(false);
    }

    // Hàm xử lý lọc phòng
    const handleDataFilter = async (startDate, endDate, guestLimit) => {
        console.log("handleDataFilter nhận giá trị:", startDate, endDate, guestLimit);

        // Cập nhật dữ liệu lọc vào state
        setDataFilterBook({ startDate, endDate, guestLimit });
        setCurrentPage(1); // Reset về trang đầu
        setDates({ checkin: startDate, checkout: endDate });

        // Gọi API lọc và cập nhật danh sách phòng
        try {
            const res = await getFilterBooking(startDate, endDate, guestLimit, 1, pageSize); // Trang đầu tiên
            setTypeRoom(res.content); // Cập nhật danh sách phòng
            setTotalPages(res.totalPages); // Cập nhật tổng số trang từ API
            console.log("Dữ liệu khi lọc thành công: ", res.content);

        } catch (error) {
            console.error("Lỗi khi gọi API filterBooking:", error);
        }
    };

    useEffect(() => {
        if (location.state) {
            const { checkIn, checkOut, guest } = location.state;

            if (checkIn && checkOut && guest) {
                console.log("Dữ liệu hợp lệ từ location.state:", { checkIn, checkOut, guest });
                handleDataFilter(checkIn, checkOut, guest);
            } else {
                console.error("Dữ liệu từ location.state không đầy đủ!");
            }
        } else {
            console.log("Không có location.state.");
        }
    }, [location.state]);


    const filterBooking = async (startDate, endDate, guestLimit, page, size) => {
        try {
            const res = await getFilterBooking(startDate, endDate, guestLimit, page, size);
            setTypeRoom(res.content);
            setTotalPages(res.totalPages); // Assuming totalPages is part of the response from filter API
            console.log(res.content);
        } catch (error) {
            console.log("Lỗi API trả về: ", error);
        }
    };

    const handleDatesFromChild = (checkin, checkout) => {
        setDates({ checkin, checkout }); // Lưu dữ liệu từ file con vào state
        console.log("Received dates from child:", { checkin, checkout });
    };

    const handleDeselectRoom = (roomId) => {
        // Logic to deselect the room
        setSelectedRooms((prevSelectedRooms) => prevSelectedRooms.filter((room) => room.roomId !== roomId));
    };

    // Show alert if there's an error
    const renderAlert = alert && <Alert type={alert.type} title={alert.title} />;

    return (
        <Layoutemployee title={"Danh sách đặt phòng trực tiếp"} icons={cilSpreadsheet}>
            <div className="container-xxl py-5">
                <div className="container" style={{ marginTop: "67px" }}>
                    <BookingFillter onFilter={handleDataFilter} onSendDates={handleDatesFromChild} />
                    {renderAlert}

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {typeRoom.length === 0 ? (
                            <div className="col-12 text-center">Không có phòng nào để hiển thị.</div>
                        ) : (
                            typeRoom.map((item, key) => (
                                <div className="col-lg-12 col-md-12 col-sm-12 wow fadeInUp" data-wow-delay="0.1s" key={key}>
                                    <div className="row border-cutom">
                                        {/* Phần hiển thị phòng */}
                                        <div className="room-item rounded overflow-hidden col-md-4 mt-2" style={{}}>
                                            <div className="position-relative">
                                                <img
                                                    className="img-fluid w-100 rounded-3"
                                                    style={{ height: '271px', boxShadow: ' 0 4px 6px rgba(0, 0, 0, 0.1)' }}
                                                    src={item?.imageList?.[0]}
                                                    alt={item?.typeRoomName || "Room Image"}
                                                />
                                                <div className="d-flex flex-column align-items-start position-absolute start-0 top-100 translate-middle-y ms-4">
                                                    {/* Giá hiện tại */}
                                                    <strong className="bg-warning text-white rounded py-1 px-3 mb-2">
                                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item?.price)} / <strong>Ngày</strong>
                                                    </strong>
                                                </div>

                                            </div>

                                            {/* Thông tin phòng */}
                                            <div className="p-4 mt-2" style={{ borderRight: '1px soild' }}>
                                                <h5 className="mb-3"><strong>{item?.typeRoomName}</strong></h5>
                                                {/* Chi phí dự kiến */}
                                                {item?.estCost && (
                                                    <div className="">
                                                        <p className="text-danger fw-bold mb-0">
                                                            <strong>Chi phí dự kiến:</strong>
                                                            <span className="ms-2">
                                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.estCost)}
                                                            </span>
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="mb-3 mt-2" style={{ fontSize: "1rem" }}>
                                                    <strong>Sức chứa: </strong>Tối đa {item?.guestLimit} người
                                                </div>

                                                {/* Tiện nghi phòng */}
                                                <div className="mb-3">
                                                    <strong>Tiện nghi phòng:</strong>
                                                    <div className="d-flex flex-wrap mt-2">
                                                        {item?.amenitiesDetails?.slice(0, 3).map((amenity, idx) => (
                                                            <small
                                                                className="border-end me-3 pe-3 d-flex align-items-center mb-2"
                                                                key={idx}
                                                                style={{ fontSize: "1.2rem" }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontSize: "1rem"
                                                                    }}
                                                                    title={amenity}
                                                                >
                                                                    &nbsp;{amenity}
                                                                </span>
                                                            </small>
                                                        ))}
                                                        {item?.amenitiesDetails?.length > 3 && (
                                                            <small
                                                                className="more-amenities"
                                                                style={{ fontSize: "1.2rem", color: "#FEA116" }}
                                                                title="Click to see more amenities"
                                                            >
                                                                &nbsp;...
                                                            </small>
                                                        )}
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-4">
                                                        <Button className="btn btn-sm btn-primary rounded py-2 px-4" onClick={() => getDataDetail(item.typeRoomId)}>
                                                            Chi tiết
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Danh sách đặt phòng */}
                                        <ListRooms
                                            item={item}
                                            selectedRooms={selectedRooms}
                                            handleSelectRoom={handleSelectRoom}
                                            handleDeselectRoom={handleDeselectRoom}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination buttons */}
                    <div className="pagination mt-4 d-flex justify-content-center">
                        <Button
                            className="btn btn-secondary me-2"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Trước
                        </Button>
                        <span className="d-flex align-items-center">
                            Trang {currentPage} trên {totalPages}
                        </span>
                        <Button
                            className="btn btn-secondary ms-2"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Tiếp theo
                        </Button>
                    </div>
                </div>
                {/* Sticky Selected Room Bar */}
                <FloatingBubble
                    selectedRooms={selectedRooms}
                    handleRemoveRoom={handleRemoveRoom}
                    calculateTotalPrice={calculateTotalPrice}
                    loading={loading}
                    handleBooking={handleBooking}
                />
                <RoomDetail show={showModal} onClose={() => setShowModal(false)} room={roomItem} />
                {modalCancel && <CancelBookingModal handleClose={handleCloseCancel} booking={booking} />}
                {showModalCustomer && <InsertCustomer bookingRoom={booking.bookingRooms} onClose={handleLoseModalCustomer} bookingoff={true} close={handleSaveModalCustomer} />}
            </div >
        </Layoutemployee>
    );
}
