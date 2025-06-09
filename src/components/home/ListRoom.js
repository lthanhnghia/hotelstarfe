import React, { useCallback, useEffect, useState } from "react";
import CommonHeading from "../common/CommonHeading";
import { getDetailListTypeRoom, getListRoom } from "../../services/client/home";
import Alert from "../../config/alert";
import { Button } from "react-bootstrap";

import RoomDetail from "../../pages/client/Room/modal-room/RoomDetail";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/custom/Filter.css";
import "../../assets/css/custom/cardBorder.css";
import BookingFillter from "../../pages/account/Filter/FilterBooking";
import { getFilterBooking } from "../../services/client/home";
import { Cookies } from 'react-cookie';
import Swal from 'sweetalert2';
import { ListRooms } from "./Componet/ListRooms";
import FloatingBubble from "./Componet/FloatingBubble";

export default function ListRoom() {
    const [showModal, setShowModal] = useState(false);
    const [roomItem, setRoomItem] = useState([]);
    const [typeRoom, setTypeRoom] = useState([]);
    const [alert, setAlert] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const [totalPages, setTotalPages] = useState(1); // Total pages state
    const pageSize = 9;
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
        // Kiểm tra nếu có dữ liệu trong sessionStorage (valueFillter)
        const sessionData = sessionStorage.getItem("valueFillter");

        if (sessionData) {
            // Nếu sessionStorage có dữ liệu, parse và gọi filterBooking
            const parsedData = JSON.parse(sessionData);
            const { checkIn, checkOut, guest, typeRoomID } = parsedData;

            setDates({ checkin: checkIn, checkout: checkOut })
            // Gọi filterBooking thay vì handleDataFilter nếu dữ liệu có từ sessionStorage
            filterBooking(checkIn, checkOut, guest, currentPage, pageSize);
        } else if (!location.state) {
            if (dataFilterBook.startDate || dataFilterBook.endDate || dataFilterBook.guestLimit) {
                filterBooking(dataFilterBook.startDate, dataFilterBook.endDate, dataFilterBook.guestLimit, currentPage, pageSize);
            } else {
                fetchRooms();
            }
        } else {
            // Nếu có dữ liệu từ location.state, kiểm tra và gọi filterBooking
            const { checkIn, checkOut, guest, typeRoomID } = location.state;
            if ((checkIn && checkOut && guest) || typeRoomID) {
                console.log("Dữ liệu hợp lệ từ location.state:", { checkIn, checkOut, guest, typeRoomID });
                // Gọi filterBooking với dữ liệu từ location.state
                filterBooking(checkIn, checkOut, guest, currentPage, pageSize);
            } else {
                console.error("Dữ liệu từ location.state không đầy đủ!");
            }
        }
    }, [currentPage, dataFilterBook]);


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
        const cookies = new Cookies();
        const token = cookies.get('token');
        // Kiểm tra người dùng đã đăng nhập chưa
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Yêu cầu đăng nhập',
                text: 'Bạn cần đăng nhập để thực hiện chức năng đặt phòng.',
                confirmButtonText: 'Đăng nhập ngay',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login-customer"); // Chuyển hướng đến trang đăng nhập
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
            roomName: Object?.roomName[selectedRoomIndex],
            price: Object?.price,
            typeRoomName: Object?.typeRoomName,
            description: Object?.description ?? "",
            imageList: Object?.imageList,
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
        // Tính tổng tiền sau khi chọn phòng
        calculateTotalPrice();
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
        // Lấy dữ liệu valueFillter từ session storage
        const valueFillter = JSON.parse(sessionStorage.getItem("valueFillter"));

        if (!valueFillter || !selectedRooms || selectedRooms.length === 0) {
            return 0; // Trả về 0 nếu không có dữ liệu hoặc không có phòng đã chọn
        }

        // Chuyển đổi ngày checkIn và checkOut thành đối tượng Date
        const checkinDate = new Date(valueFillter.checkIn);
        const checkoutDate = new Date(valueFillter.checkOut);

        // Tính số đêm bằng cách trừ ngày checkIn và checkOut
        const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24);

        if (nights <= 0) {
            return 0; // Nếu ngày checkOut trước hoặc bằng checkIn, trả về 0
        }

        // Tính tổng tiền cho tất cả các phòng đã chọn
        const total = selectedRooms.reduce((total, room) => {
            return total + (room.price * nights); // Tính tiền cho từng phòng (nights * room price)
        }, 0);

        console.log("Tổng tiền: ", total);
        return total;
    };


    // Hàm xử lý đặt phòng
    const handleBooking = () => {
        if (selectedRooms.length > 0) {
            const roomDetails = selectedRooms.map((room) => ({
                roomId: room.roomId,
                price: room.price,
                checkin: dates.checkin,
                checkout: dates.checkout
            }));

            console.log("Đang đặt phòng:", roomDetails);
            console.log(`Bạn đã đặt thành công ${selectedRooms.length} phòng.`);

            // Dữ liệu tạm thời để lưu vào state và sessionStorage
            const updateFilterBooking = { startDate: dates.checkin, endDate: dates.checkout };

            // Lưu danh sách roomId vào sessionStorage
            saveArrayToSession("bookedRooms", roomDetails);
            const bookingDataJSON = JSON.stringify(updateFilterBooking);
            sessionStorage.setItem('booking', bookingDataJSON);

            //Bất đầu tải trang
            setLoading(true);
            let timerInterval;
            Swal.fire({
                title: "Đang xử lý đặt phòng...",
                html: "Chờ một chút, bạn sẽ được chuyển hướng.",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    if (timer) { // Kiểm tra xem phần tử b có tồn tại không
                        timerInterval = setInterval(() => {
                            timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                    }
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                // Sau khi thông báo tự động đóng, đóng modal
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log("Thông báo đã đóng tự động.");
                }
            });
            // Điều hướng tới trang đặt phòng
            setTimeout(() => {
                navigate("/client/booking-room");
                window.scrollTo(0, 0);
            }, 1000);


            //Dừng tải lại trang
            setLoading(false);

            // Reset danh sách phòng
            setSelectedRooms([]);
            return roomDetails;
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Yêu cầu chọn phòng',
                text: 'Vui lòng chọn phòng trước khi đặt!',
                confirmButtonText: 'Oke',
            });

            console.log("Vui lòng chọn phòng trước khi đặt!");
            return null;
        }
    };


    const handleDataFilter = useCallback(async (startDate, endDate, guestLimit, typeRoomID) => {
        console.log("handleDataFilter nhận giá trị:", startDate, endDate, guestLimit);
        console.log('typeRoom: ', typeRoomID);

        // Lưu giá trị vào sessionStorage
        sessionStorage.setItem("selectedTypeRoom", typeRoomID);

        // Cập nhật dữ liệu lọc vào state
        setDataFilterBook({ startDate, endDate, guestLimit });
        setCurrentPage(1); // Reset về trang đầu
        setDates({ checkin: startDate, checkout: endDate });

        try {
            // Lấy giá trị typeRoomID từ sessionStorage (đảm bảo luôn lấy giá trị đúng)
            const savedTypeRoomID = sessionStorage.getItem("selectedTypeRoom");
            console.log("Lấy typeRoomID từ sessionStorage:", savedTypeRoomID);

            // Kiểm tra nếu savedTypeRoomID có giá trị hợp lệ, nếu không sử dụng giá trị mặc định
            const validTypeRoomID = savedTypeRoomID ? parseInt(savedTypeRoomID) : 0;
            console.log("typeRoomID sử dụng khi gọi API:", validTypeRoomID);

            // Gọi API lọc phòng với giá trị typeRoomID đã được lấy từ sessionStorage
            const res = await getFilterBooking(startDate, endDate, guestLimit, 1, pageSize, validTypeRoomID);

            if (res && res.content) {
                setTypeRoom(res.content); // Cập nhật danh sách phòng
                setTotalPages(res.totalPages); // Cập nhật tổng số trang từ API
            } else {
                console.error("Không có dữ liệu phòng trong phản hồi từ API");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API filterBooking:", error);
        }
    }, [pageSize, getFilterBooking]);

    useEffect(() => {
        if (location.state) {
            const { checkIn, checkOut, guest, typeRoomID } = location.state;
            const typeRoom_ID = parseInt(sessionStorage.getItem("selectedTypeRoom"));
            if ((checkIn && checkOut && guest) || typeRoomID) {
                console.log("Dữ liệu hợp lệ từ location.state:", { checkIn, checkOut, guest, typeRoom_ID });
                handleDataFilter(checkIn, checkOut, guest, typeRoomID);
            } else {
                console.error("Dữ liệu từ location.state không đầy đủ!");
            }
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
        <div className="container-xxl py-5">
            <div className="container">
                <BookingFillter onFilter={handleDataFilter} onSendDates={handleDatesFromChild} />
                <CommonHeading heading="Phòng của chúng tôi" title="Phòng" subtitle="Khám phá" />
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
                                                <strong>
                                                    <small className="bg-warning text-white rounded py-1 px-3 mb-2">
                                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item?.price)} / <strong>Ngày</strong>
                                                    </small>
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
        </div >
    );
}
