import { request } from "../../config/configApi";
import Cookies from 'js-cookie';

const getCookie = () => {
    const cookie = Cookies.get("token");
    return cookie;
}

const getDataReservations = async () => {
    try {
        const res = await request({
            method: "GET",
            path: '/api/reservations/getAll',
            token: getCookie()
        });

        // Đảm bảo trả về dữ liệu nếu là mảng
        if (Array.isArray(res)) {
            return res;  // Trả về dữ liệu nếu là mảng
        } else {
            throw new Error("Dữ liệu không phải là mảng");
        }
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu đặt phòng:', error);
        throw error;  // Ném lỗi để có thể xử lý ở nơi gọi hàm
    }
}

const getByIdBooking = async (id,roomName) => {
    try {
        const res = await request({
            method: "GET",
            path: `/api/reservations/selectBookingById?bookingId=${id}&roomName=${roomName}`,
            token: getCookie()
        });
        return res;
    } catch (error) {
        throw new Error("Lỗi khi lấy dữ liệu tư API: ", error)
    }
}

const updateStatusBooking = async (id) => {
    try {
        const res = await request({
            method: "PUT",
            path: `/api/reservations/statusBooking?bookingId=${id}`,
            token: getCookie()
        });
        return res;
    } catch (error) {
        throw new Error("Lỗi khi lấy dữ liệu từ api: ", error);
    }
}
export { getDataReservations, getByIdBooking, updateStatusBooking };

