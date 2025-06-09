import React, { useEffect, useState } from 'react';
import { getBookingByRoom } from '../../../../services/employee/booking-manager';
import { formatDateTime } from '../../../../config/formatPrice';
import ModalDetailFloor from "../../floor_map/modalChitietPhong";

const isWithinNextWeek = (startDate, endDate) => {
    const now = Date.now(); // Lấy thời gian hiện tại dưới dạng timestamp
    const nextWeek = now + 7 * 24 * 60 * 60 * 1000; // Thời gian 7 ngày sau

    const start = new Date(startDate).getTime(); // Chuyển đổi sang timestamp
    const end = new Date(endDate).getTime();

    return (
        (start >= now && start <= nextWeek) || // Ngày bắt đầu nằm trong khoảng từ hiện tại đến 7 ngày tới
        (end >= now && end <= nextWeek) ||     // Ngày kết thúc nằm trong khoảng từ hiện tại đến 7 ngày tới
        (start < now && end > nextWeek)        // Bao trùm cả tuần tiếp theo
    );
};
function calculatePosition(start, end, startDate, endDate) {
    const filterStartDate = new Date(startDate || new Date());
    const filterEndDate = new Date(filterStartDate);
    filterEndDate.setDate(filterStartDate.getDate() + 7); // Ensures a 7-day range

    const totalDuration = Math.max(1, filterEndDate - filterStartDate); // Total range in milliseconds

    // Ensure boundaries are clipped to the filter range
    const startTime = Math.max(new Date(start).getTime(), filterStartDate.getTime());
    const endTime = Math.min(new Date(end).getTime(), filterEndDate.getTime());

    // Ensure valid range
    if (endTime < startTime) return { position: 0, width: 0 };

    const position = ((startTime - filterStartDate.getTime()) / totalDuration) * 100;
    const width = ((endTime - startTime) / totalDuration) * 100;

    return { position: Math.max(0, position), width: Math.max(0, width) };
}


function RoomSchedule({ room, startDate, endDate }) {
    const [bookings, setBookings] = useState([]);
    const [bookingDetail, setbookingDetail] = useState({});
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        console.log(filteredBookings);
        
        const fetchBookings = async () => {
            try {
                const data = await getBookingByRoom(room?.id);
                setBookings(data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        if (room?.id) {
            fetchBookings();
        }
    }, [bookingDetail]);
    const handleShowModalDetail = (item) => {
        setbookingDetail(item);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const filteredBookings = bookings.filter((reservation) => {
        const resStart = new Date(reservation.startAt);
        const resEnd = new Date(reservation.endAt);
    
        const filterStartDate = new Date(startDate || new Date()); // Ngày hiện tại nếu không chọn
        const filterEndDate = new Date(endDate || new Date());
        filterEndDate.setDate(filterEndDate.getDate() + 7); // Thêm 7 ngày nếu không chọn
    
        return (
            (resStart >= filterStartDate && resStart <= filterEndDate) ||
            (resEnd >= filterStartDate && resEnd <= filterEndDate) ||
            (resStart <= filterStartDate && resEnd >= filterEndDate)
        );
    });
    
    
    
    const getStatusCss = (status) => {
        switch (status) {
            case 2: 
                return 'badge text-bg-primary badge text-nowrap ng-star-inserted col-md-4 col-4 mx-3'; // Khách hàng đã xác nhận
            case 4: 
                return 'badge text-bg-info badge text-nowrap ng-star-inserted col-md-4 col-4 mx-3'; // Đã đặt trước
            case 5: 
                return 'badge text-bg-danger badge text-nowrap ng-star-inserted col-md-4 col-4 mx-3'; // Quá hạn trả
            case 6: 
                return 'badge text-bg-danger badge text-nowrap ng-star-inserted col-md-4 col-4 mx-3'; // Đã hủy
            case 7: 
                return 'badge text-bg-warning badge text-nowrap ng-star-inserted col-md-4 col-4 mx-3'; // Trả phòng
            case 10: 
                return 'badge text-bg-secondary badge text-nowrap ng-star-inserted col-md-4 col-4 mx-3'; // Trả phòng
            default: 
                return 'badge text-bg-success text-dark badge text-nowrap ng-star-inserted col-md-4 col-4 mx-3'; // Mặc định
        }
    };

    return (
        <div className="room-schedule">
            <div className="room-name">{room.roomName}</div>
            <div className="reservations">
                {filteredBookings.map((reservation, index) => {
                    const { position, width } = calculatePosition(
                        reservation.startAt,
                        reservation.endAt,
                        startDate,
                        endDate
                    );
                    const checkInTime = new Date(reservation.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const checkOutTime = new Date(reservation.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                        <div
                            key={index}
                            onClick={() => handleShowModalDetail(reservation)}
                            className={getStatusCss(reservation.statusBookingDto.id)}
                            style={{
                                left: `${position}%`,
                                width: `${width}%`,
                                maxWidth: "100%",
                                position: 'absolute',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            title={`${reservation?.accountDto.fullname} ${formatDateTime(reservation.startAt)} - ${formatDateTime(reservation.endAt)}`}
                        >
                            {reservation.statusBookingDto.id === 10 ? "Bảo trì" : reservation?.accountDto.fullname} {checkInTime} - {checkOutTime}
                        </div>
                    );
                })}
            </div>
            {showModal && <ModalDetailFloor onClose={handleCloseModal} booking={bookingDetail} />}
        </div>
    );
}


export default RoomSchedule;
