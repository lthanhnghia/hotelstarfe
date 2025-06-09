import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { getBookingRoomByRoom } from "../../../../services/employee/floor";
import { Cookies } from "react-cookie";
import { getBookingRoomInformation } from "../../../../services/admin/account-manager";
import { format } from "date-fns";
import { formatCurrency } from "../../../../config/formatPrice";
import NhanPhong from "../modalNhanPhong";
import ConfirmBookingModal from "../../list-reservation/modalXacNhan";
import { bookingServiceRoom } from "../../../../services/employee/service";
import { getIdBooking } from "../../../../config/idBooking";
const ModalDetailFloor = ({ onClose, item, booking }) => {
    const [bookingRoom, setBookingRoom] = useState({});
    const [customer, setCustomer] = useState([]);
    const [services, setServices] = useState([]);
    const encodedIdBookingRoom = item ? btoa(bookingRoom.id) : btoa(booking?.bookingRooms[0]?.id);
    const cookie = new Cookies();
    const token = cookie.get("token");
    useEffect(() => {
        if (item && token) {
            handleDetail(item?.id, item?.statusRoomDto?.id, token);
            handleCustomerInfo(item?.id, token);
        }
        handleService()
    }, [item, booking]);

    const handleService = async () => {
        if (booking && booking.bookingRooms && booking.bookingRooms.length > 0) {
            const idBookingRoom = booking.bookingRooms.map(e => e.id);
            const services = await bookingServiceRoom(idBookingRoom);
            setServices(services);
        }
    }

    const handleCustomerInfo = async (id, token) => {
        try {
            const data = await getBookingRoomInformation(id, token);
            setCustomer(data);
        } catch (error) {

        }
    }
    const handleDetail = async (roomId, statusId, token) => {
        try {
            const data = await getBookingRoomByRoom(roomId, statusId, token);

            if (data && data.length > 0) {
                // Sắp xếp danh sách booking theo thời gian tạo tăng dần (cũ nhất trước, mới nhất ở cuối)
                const latestBooking = data.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)).pop();

                setBookingRoom(latestBooking); // Chỉ lưu booking mới nhất (cuối cùng)
            } else {
                setBookingRoom(null); // Không có booking
                console.log("Không có booking nào.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết booking:", error);
        }
    };

    const formatDateTime = (date) => {
        if (!date || isNaN(new Date(date))) {
            console.error('Giá trị thời gian không hợp lệ:', date);
            return 'Invalid date';
        }
        return format(new Date(date), 'dd/MM/yyyy HH:mm:ss');
    };
    const calculateDuration = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 'N/A';
    
        const start = new Date(checkIn);
        const end = new Date(checkOut);
    
        if (isNaN(start) || isNaN(end)) return 'N/A';
    
        // Tính khoảng thời gian thuê tính bằng milliseconds
        const diffMs = end - start;
    
        // Tính số ngày và làm tròn lên nếu có dư thời gian
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
        return `${diffDays} ngày`;
    };
    
    const dataRooms = () => {
        if (booking && booking.bookingRooms && booking.bookingRooms.length > 0) {
            const roomNames = booking.bookingRooms.map((e) => e.room.roomName.replace("Phòng ", ""));
            return `Phòng ${roomNames.join(", ")}`; // Nếu có nhiều phòng, nối tên các phòng với dấu phẩy
        }
        return "";
    }

    const totalPrice = () => {
        if (booking && booking.bookingRooms && booking.bookingRooms.length > 0) {
            const totalPriceBookingRoom = booking.bookingRooms.map((e) => e.price || 0);
            const totalBookingRoomPrice = totalPriceBookingRoom.reduce((sum, price) => sum + price, 0);
            const totalPriceService = services.reduce((total, item) => {
                return total + (item.price || 0) * (item.quantity || 0);
            }, 0);
            console.log(totalPriceService);

            return totalBookingRoomPrice + totalPriceService;
        }
        return 0;
    }

    return (
        <Modal className="custom-modal-width modal-noneBg" show={true} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết {item?.roomName || dataRooms()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="boxster">
                    <div className="d-flex align-items-center mb-3">
                        <h3 className="font-weight-bold mb-0">{item?.roomName || dataRooms()}</h3>
                        <span className={item ? "text-success ms-auto" : booking?.statusBookingDto?.id === 6 ? "text-danger ms-auto" : "text-success ms-auto"}>{item?.statusRoomDto?.statusRoomName || booking?.statusBookingDto?.statusBookingName == "trả phòng" ? "Đang sử dụng" : booking?.statusBookingDto?.statusBookingName}</span>
                    </div>
                    <hr />
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <Form.Label className="text-muted">Tên khách hàng</Form.Label>
                            <div className="font-weight-medium">{bookingRoom?.booking?.accountDto?.fullname || booking?.accountDto?.fullname}</div>
                        </div>
                        <div className="col-lg-4">
                            <Form.Label className="text-muted">Khách lưu trú</Form.Label>
                            <div className="font-weight-medium">{customer.length > 0 ? customer.length : 1} người</div>
                        </div>
                        <div className="col-lg-4">
                            <Form.Label className="text-muted">Mã đặt phòng</Form.Label>
                            <div className="font-weight-medium">{getIdBooking(booking?.id, booking?.createAt)}</div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-lg-4">
                            <Form.Label className="text-muted">Nhận phòng</Form.Label>
                            <div className="font-weight-medium">{formatDateTime(bookingRoom?.booking?.startAt || booking?.startAt)}</div>
                        </div>
                        <div className="col-lg-4">
                            <Form.Label className="text-muted">Trả phòng</Form.Label>
                            <div className="font-weight-medium">{formatDateTime(bookingRoom?.booking?.endAt || booking?.endAt)}</div>
                        </div>
                        <div className="col-lg-4">
                            <Form.Label className="text-muted">Thời gian thuê</Form.Label>
                            <div className="font-weight-medium">
                                {calculateDuration(bookingRoom?.booking?.startAt || booking?.startAt, bookingRoom?.booking?.endAt || booking?.endAt)}
                                {(bookingRoom?.booking?.endAt || booking?.endAt) && new Date() > new Date(bookingRoom?.booking?.endAt || booking?.endAt) && (
                                    <span className="text-danger"> (Đã quá hạn)</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex spacer spacer-lg justify-content-between w-100 align-items-start mt-3 ng-star-inserted">
                    <div className="flex-fill">
                        <div className="form-row form-labels-50">
                            <label className="col-form-label font-semibold text-nowrap">Ghi chú </label>
                            <div className="col-form-control">
                                <textarea id="note-booking-calendar" maxlength="1000"
                                    name="note"
                                    className="form-control form-control-line max-width-400 ng-pristine ng-valid ng-touched"
                                    style={{ height: "2rem", width: "18em" }}>
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <div className="payment-suggest-money p-4 boxster">
                        <div className="payment-form-row form-row ng-star-inserted">
                            <div className="payment-form-label col-form-label">
                                <span>{item?.roomName || 'Tổng giá'}</span>
                            </div>
                            <div className="payment-form-control col-form-control">
                                <div className="payment-form-control col-form-control payment-total-amount font-regular">
                                    <span>{formatCurrency(bookingRoom?.price || totalPrice())} VNĐ</span>
                                </div>
                            </div>
                        </div>
                        <div className="payment-form-row form-row ng-star-inserted">
                            <div className="payment-form-label col-form-label">
                                <span>Khách đã trả </span>
                            </div>
                            <div className="payment-form-control col-form-control">
                                <div className="payment-form-control fw-bolder col-form-control payment-total-amount font-regular">
                                    <span>{booking?.statusPayment ? formatCurrency(totalPrice()) : 0 || bookingRoom?.booking?.statusPayment ? formatCurrency(bookingRoom?.price) : 0} VNĐ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {item ? (
                    <Link to={`/employee/edit-room?idBookingRoom=${encodedIdBookingRoom}`}>
                        <Button variant="outline-success">Cập nhật đặt phòng</Button>
                    </Link>
                ) : (
                    ""
                )}
                {item ?
                    (item?.statusRoomDto?.id === 2 ? (
                        <Link to="/employee/edit-room">
                            <Button variant="success" >Trả phòng</Button>
                        </Link>
                    ) : (
                        <NhanPhong
                            bookingRooms={bookingRoom}
                            onClose={onClose}
                        />
                    )) : (
                        (booking?.statusBookingDto?.id !== 6 && booking?.statusBookingDto?.id !== 8) ? (
                            booking?.statusBookingDto?.id === 2 ? (
                                <ConfirmBookingModal bookingRoom={booking.bookingRooms} />
                            ) : (
                                booking?.statusBookingDto?.id === 4 ? (
                                    <NhanPhong bookingRooms={booking.bookingRooms} />
                                ) : (
                                    <Link to={`/employee/edit-room?idBookingRoom=${encodedIdBookingRoom}`}>
                                        <Button variant="outline-success" >Trả phòng</Button>
                                    </Link>
                                )
                            )
                        ) : (
                            <Link to={`/employee/edit-room?idBookingRoom=${encodedIdBookingRoom}`}>
                                <Button variant="outline-success" >Chi tiết</Button>
                            </Link>
                        )
                    )
                }

            </Modal.Footer>
        </Modal>
    );
}

export default ModalDetailFloor;
