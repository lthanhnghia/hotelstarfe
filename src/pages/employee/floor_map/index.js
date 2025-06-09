import React, { useEffect, useState } from "react";
import Layoutemployee from "../../../components/layout/employee";
import ModalDetailFloor from "./modalChitietPhong";
import ModalORR from "./modal-order-receive-room";
import { getRoomByFloorId, updateStatusRoom } from "../../../services/employee/room";
import Alert from "../../../config/alert";
import { useParams } from "react-router-dom";
import { formatCurrency, formatDate } from "../../../config/formatPrice";
import { getStatusRoom } from "../../../services/employee/status-room";
import { Cookies } from "react-cookie";
import { Spinner } from "react-bootstrap";
import { getBookingRoomByRoom } from "../../../services/employee/floor";
import DatPhong from "../list-reservation/modalDatPhong";
import { getByRoom } from "../../../services/employee/booking-room";
import ConfirmBookingModal from "../list-reservation/modalXacNhan";
import { getBookingId } from "../../../services/employee/booking-manager";
import { cilBuilding } from "@coreui/icons";
const FloorMap = () => {
    const { id } = useParams();
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState({});
    const [bookingRoom, setBookingRoom] = useState([]);
    const [alert, setAlert] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalConfirm, setModalConfirm] = useState(false);
    const [modal7, setModal7] = useState(false);
    const [statusRoom, setStatusRoom] = useState([]);
    const [booking, setBooking] = useState({});
    const cookie = new Cookies();
    const token = cookie.get("token");

    const handleShowModalDetail = async (item) => {
        const data = await getBookingId(item.booking.id)
        setBooking(data);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const [showModalOrder, setShowModalOrder] = useState(false);

    const handleShowModalOrder = (item) => {
        setRoom(item);
        setShowModalOrder(true);
    };
    const handleCloseModalOrder = () => {
        setShowModalOrder(false);
    };

    const handleShowModalConfirm = (item) => {
        setBooking(item.booking);

        setModalConfirm(true);
    }
    const handleCloseModalConfirm = () => {
        setModalConfirm(false);
    }
    const handleShowModalDetail7 = async (item) => {
        const data = await getBookingId(item.booking.id)
        setBooking(data);
        setModal7(true);
    }
    const handleCloseModalDetail7 = () => {
        setModal7(false);
    }

    useEffect(() => {
        handleRoomByFloor();
    }, [id, room]);
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 500);
            return () => clearTimeout(timer);
        }
    }, [alert]);


    const handleRoomByFloor = async () => {
        try {
            const data = await getRoomByFloorId(id);
            if (data) {
                setRooms(data);
                const bookingRooms = {};
                await Promise.all(data.map(async (room) => {
                    const bookingRoomData = await getByRoom(room.id);
                    bookingRooms[room.id] = bookingRoomData;
                }));
                setBookingRoom(bookingRooms);
                const statusRooms = {};
                await Promise.all(data.map(async (room) => {
                    const statusRoomData = await getStatusRoom(room.statusRoomDto?.id);
                    statusRooms[room.statusRoomDto?.id] = statusRoomData;
                }));
                setStatusRoom(statusRooms);
                const bookings = {};
                await Promise.all(data.map(async (room) => {
                    const bookingData = await getBookingRoomByRoom(room.id, room?.statusRoomDto?.id, token);

                    if (bookingData && bookingData.length > 0) {
                        const latestBooking = bookingData.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)).pop();
                        bookings[room?.id] = latestBooking;
                    } else {
                        bookings[room?.id] = null;
                    }
                }));
                setBooking(bookings);
            } else {
                setAlert({ type: "error", title: "Lỗi không có dữ liệu" });
            }
        } catch (error) {
            setAlert({ type: "error", title: error.message });
        }
    };

    const handleUpdateStatusRoom = async (roomId, statusId) => {
        if (!roomId && !statusId) {
            setAlert({ type: "error", title: "Lỗi không xác định" });
            return;
        }
        const room = {
            id: roomId,
            statusRoomId: statusId
        }
        try {
            setIsLoading(true);
            const data = await updateStatusRoom(room, token);
            handleRoomByFloor();
            if (data) {
                setAlert({ type: data.status, title: data.message });
            }
        } catch (error) {
            setAlert({ type: "error", title: error.message });
        }finally{
            setIsLoading(false);
        }
    }


    const getBadge = (status) => {
        switch (status) {
            case 1: return 'fa fa-bed badge-icon me-1';
            case 2: return 'bi bi-person-check-fill badge-icon me-1';
            case 3: return 'fas fa-tools badge-icon me-1';
            case 4: return 'fas fa-calendar-check badge-icon me-1';
            case 5: return 'fa fa-broom badge-icon me-1';
            default: return 'fas fa-hand-sparkles badge-icon me-1';
        }
    };
    const getStatusCss = (status) => {
        switch (status) {
            case 1: return 'badge-light-blue text-success w-auto badge text-nowrap ng-star-inserted col-md-4 col-4';
            case 2: return 'badge-light-blue text-success w-auto badge text-nowrap ng-star-inserted col-md-4 col-4';
            case 3: return 'badge-light-danger w-auto badge text-nowrap ng-star-inserted col-md-4 col-4';
            case 4: return 'badge-light-blue text-success w-auto badge text-nowrap ng-star-inserted col-md-4 col-4';
            case 5: return 'badge-light-danger w-auto badge text-nowrap ng-star-inserted col-md-4 col-4';
            default: return 'badge-light-neutral w-auto badge text-nowrap ng-star-inserted col-md-4 col-4';
        }
    };
    const isOverdue = (checkOutTime) => {
        if (!checkOutTime) return false; // Nếu không có thời gian trả phòng thì không quá hạn
        const currentTime = new Date();
        const checkout = new Date(checkOutTime);
        return currentTime > checkout; // Quá giờ trả phòng nếu thời gian hiện tại lớn hơn thời gian trả phòng
    };
    const isOverdueCheckIn = (booking) => {
        if (!booking.startAt) return false; // Nếu không có thời gian nhận thì không quá hạn
        if (booking.statusDto.id !== 4) return false;
        const currentTime = new Date();
        const checkinTime = new Date(booking.startAt);
        return currentTime > checkinTime; // Trả về true nếu hiện tại lớn hơn thời gian nhận
    };

    const calculateDuration = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 'N/A';
    
        const start = new Date(checkIn);
        const end = new Date(checkOut);
    
        if (isNaN(start) || isNaN(end)) return 'N/A';
    
        const diffMs = end - start; // Khoảng thời gian thuê tính bằng milliseconds
        
        if (diffMs < 0) return '0 phút'; // Return '0' if the duration is negative
    
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // Số ngày
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Số giờ còn lại
    
        if (diffDays > 0) {
            return `${diffDays} ngày ${diffHours} giờ`;
        } else if (diffHours > 0) {
            return `${diffHours} giờ`;
        } else {
            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Số phút
            return `${diffMinutes} phút`;
        }
    };
    
    const getBookingStatusCss = (statusId) => {
        switch (statusId) {
            case 2:
                return "bg-success text-white reception-item";
            case 7:
                return "bg-primary text-white reception-item";
            case 4:
                return "bg-info text-white reception-item";
            case 5:
                return "bg-danger text-white reception-item";
            default:
                return "bg-secondary text-white reception-item";
        }
    };
    const openModal = (statusId, item) => {
        if (statusId === 2) {
            return handleShowModalConfirm(item);
        } else if (statusId === 4) {
            return handleShowModalDetail(item);
        } else if (statusId === 7) {
            return handleShowModalDetail7(item);
        } else {
            return handleShowModalDetail(item);
        }
    };


    return (
        <Layoutemployee title={"Sơ đồ tầng"} icons={cilBuilding}>
            <div className="reception-wrapper min-height-400 container-fluid pb-3 ng-star-inserted">
                {alert && <Alert type={alert.type} title={alert.title} />}
                {isLoading && (
                    <div className="overlay-loading">
                        <div className="spinner-wrapper">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    </div>
                )}
                <div className="reception-floors ng-star-inserted mt-3">
                    <div className="divider">
                        <div className="spacer max-w-100">
                            <h2 className="d-flex align-items-center mb-0 max-w-100">
                                <span className="text-limit">Tầng {id}</span>
                                <span className="font-medium text-neutral my-1">({rooms.length})</span>
                            </h2>
                        </div>
                    </div>
                    <div className="row row-padding-3 ng-star-inserted">
                        {rooms.map((item, index) => {
                            const bookingInfo = bookingRoom[item.id]; // Lấy thông tin bookingRoom của phòng
                            if (!bookingInfo) {
                                // Trường hợp bookingRoom trống
                                return (
                                    <div key={index} className="col-lg-3 col-md-4 col-12 mb-2 ng-star-inserted">
                                        <div className="reception-item">
                                            <div>
                                                <div className="reception-item-header row">
                                                    <span className={getStatusCss(item?.statusRoomDto.id === 6 ? 1 : item?.statusRoomDto.id)}>
                                                        <i className={getBadge(item?.statusRoomDto.id === 6 ? 1 : item?.statusRoomDto.id)}></i>
                                                        {item?.statusRoomDto.statusRoomName === "Sạch" ? "phòng trống" : item?.statusRoomDto.statusRoomName}
                                                    </span>
                                                    <div className="dropdown-center col-md-3 col-3">
                                                        <button
                                                            style={{ backgroundColor: 'transparent', border: 'none' }}
                                                            className="btn dropdown-toggle"
                                                            type="button"
                                                            data-bs-toggle="dropdown"
                                                        >
                                                            <i
                                                                className="fas fa-ellipsis-v"
                                                                style={{ color: "black", fontSize: "15px", marginTop: "auto" }}
                                                            ></i>
                                                        </button>
                                                        <div className="dropdown-menu mt-2 pt-1 pe-2 px-1 translateform" style={{ minWidth: "10px", borderRadius: "15px", marginRight: "15px" }}>
                                                            {statusRoom[item.statusRoomDto.id] && statusRoom[item.statusRoomDto.id].length > 0 ? (
                                                                statusRoom[item.statusRoomDto.id].map((statusItem, statusIndex) => (
                                                                    <a key={statusIndex} className="dropdown-item" onClick={() => handleUpdateStatusRoom(item?.id, statusItem?.id)}>
                                                                        {statusItem.statusRoomName}
                                                                    </a>
                                                                ))
                                                            ) : (
                                                                <a className="dropdown-item">Không có trạng thái</a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="reception-item-body" onClick={() => handleShowModalOrder(item)}>
                                                    <div className="reception-info d-flex spacer align-items-center flex-nowrap mb-2">
                                                        <h2 className="reception-room-name mb-0 tag-neutral" title={item?.roomName}>
                                                            {item?.roomName}
                                                        </h2>
                                                    </div>
                                                    <div className="reception-info ng-star-inserted">
                                                        <h4 className="reception-room-name mb-1" title="Phòng 01 giường đôi cho 2 người">
                                                            {item.typeRoomDto.typeRoomName}
                                                        </h4>
                                                        <div className="reception-room-price ng-star-inserted">
                                                            <i className="far fa-calendar-alt icon-mask icon-xs me-1"></i>
                                                            {formatCurrency(item.typeRoomDto.price)} VNĐ
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // Xử lý khi bookingRoom không trống
                            const bookingStatus = bookingInfo.booking.statusDto.id;
                            const bookingCss = getBookingStatusCss(bookingStatus);
                            return (
                                <div key={index} className="col-lg-3 col-md-4 col-12 mb-2 ng-star-inserted">
                                    <div className={isOverdue(bookingInfo.booking.endAt) ? getBookingStatusCss(5) : bookingCss}>
                                        <div>
                                            <div className="reception-item-header row">
                                                <span className={getStatusCss(item?.statusRoomDto.id === 6 ? 1 : item?.statusRoomDto.id)}>
                                                    <i className={getBadge(item?.statusRoomDto.id)}></i>
                                                    {item?.statusRoomDto.statusRoomName}
                                                </span>
                                                <div className="dropdown-center col-md-3 col-3">
                                                    <button
                                                        style={{ backgroundColor: 'transparent', border: 'none' }}
                                                        className="btn dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                    >
                                                        <i
                                                            className="fas fa-ellipsis-v"
                                                            style={{ color: "black", fontSize: "15px", marginTop: "auto" }}
                                                        ></i>
                                                    </button>
                                                    <div className="dropdown-menu mt-2 pt-1 pe-2 px-1 translateform" style={{ minWidth: "10px", borderRadius: "15px", marginRight: "15px" }}>
                                                        {statusRoom[item.statusRoomDto.id] && statusRoom[item.statusRoomDto.id].length > 0 ? (
                                                            statusRoom[item.statusRoomDto.id].map((statusItem, statusIndex) => (
                                                                <a key={statusIndex} className="dropdown-item" onClick={() => handleUpdateStatusRoom(item?.id, statusItem?.id)}>{statusItem.statusRoomName}</a>
                                                            ))
                                                        ) : (
                                                            <a className="dropdown-item">Không có trạng thái</a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="reception-item-body" onClick={() => openModal(bookingInfo.booking.statusDto.id, bookingInfo)}>
                                                <div className="reception-info d-flex spacer align-items-center flex-nowrap mb-2">
                                                    <h2 className="reception-room-name mb-0 tag-neutral" title={item?.roomName}> {item?.roomName} </h2>
                                                </div>
                                                <div className="reception-info ng-star-inserted">
                                                    <div className="reception-customer">
                                                        <h4 className="reception-room-name mb-0">
                                                            {bookingInfo.booking?.accountDto?.fullname || "Không rõ tên"}
                                                        </h4>
                                                        <span className="reception-room-phone ng-star-inserted">&nbsp;</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ng-star-inserted">
                                                <div className="badge badge-light-neutral text-limit ng-star-inserted">
                                                    <i className="fas fa-clock icon-badge icon-xs ht-mr-1"></i>
                                                    <span>{calculateDuration(bookingInfo?.booking?.startAt, new Date())} / {calculateDuration(bookingInfo?.booking?.startAt, bookingInfo?.booking?.endAt)}
                                                        <strong className="mx-1 fw-medium">{isOverdueCheckIn(bookingInfo.booking)
                                                            ? "Quá hạn nhận" : isOverdue(bookingInfo.booking.endAt)
                                                                ? "Quá hạn trả" : bookingInfo.booking?.statusDto?.id === 7
                                                                    ? "Đang sử dụng" : bookingInfo.booking?.statusDto?.id === 2 ? "Chờ xác nhận" : 
                                                                    bookingInfo.booking?.statusDto?.statusBookingName}
                                                        </strong>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
            {showModal && <ModalDetailFloor onClose={handleCloseModal} booking={booking} />}
            {modal7 && <ModalDetailFloor onClose={handleCloseModalDetail7} booking={booking} />}
            {showModalOrder && <DatPhong onClose={handleCloseModalOrder} room={room} />}
            {modalConfirm && <ConfirmBookingModal onClose={handleCloseModalConfirm} booking={booking} />}
        </Layoutemployee>
    )
}

export default FloorMap;