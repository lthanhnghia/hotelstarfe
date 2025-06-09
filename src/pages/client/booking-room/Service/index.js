import { request } from "../../../../config/configApi"
import Swal from 'sweetalert2';
import axios from "axios";


/**
 * Lấy danh sách loại phòng dựa trên ID
 * @param {Array} roomIds - Mảng chứa ID của các phòng
 * @returns {Object} - Phản hồi từ API
 */
const getDataListTypeRoom = async (roomIds) => {
    const res = await request({
        method: "GET",
        path: `api/room/list-room?roomId=${roomIds}`
    });
    return res;
};

/**
 * Đặt phòng với dữ liệu đặt phòng
 * @param {Object} bookingData - Dữ liệu đặt phòng
 * @returns {Object} - Phản hồi từ API
 */


const bookingRoom = async (bookingData, navigate) => {
    try {
        console.log('Dữ liệu gửi đi: ', JSON.stringify(bookingData));

        // Kiểm tra dữ liệu đầu vào
        if (!bookingData.userName || !bookingData.startDate || !bookingData.endDate || !Array.isArray(bookingData.roomId) || bookingData.roomId.length === 0 || typeof bookingData.methodPayment !== 'number') {
            throw new Error("Dữ liệu đầu vào không hợp lệ. Vui lòng kiểm tra lại.");
        }

        const isCarhPayment = bookingData.methodPayment === 1;

        if (isCarhPayment) {
            Swal.fire({
                title: 'Đang xử lý...',
                text: 'Vui lòng chờ trong giây lát.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        } else {
            let timerInterval;
            Swal.fire({
                title: "Đang chuyển đến cổng thanh toán VNPay...",
                html: "Chờ một chút, bạn sẽ được chuyển hướng đến VNPay để hoàn tất thanh toán.",
                timer: 5000,  // Thời gian đếm ngược là 5 giây (hoặc tùy chỉnh theo yêu cầu của bạn)
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
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log("Thông báo đã đóng tự động.");
                }
            });
        }

        // Gửi yêu cầu đến API với axios
        const res = await axios.post('http://localhost:8080/api/booking/sendBooking', bookingData);

        console.log("ABC: ", res.data);

        // Đóng loading nếu thanh toán bằng thẻ
        if (isCarhPayment) Swal.close();

        if (!res || typeof res.data !== 'object') {
            throw new Error("Phản hồi từ server không hợp lệ.");
        }

        if (res.data.status !== 'success') {
            throw new Error(res.data.message || "Phản hồi không hợp lệ từ server.");
        }

        if (res.data.vnPayURL) {
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await delay(2000);
            window.location.href = res.data.vnPayURL;
        } else {
            await Swal.fire({
                title: 'Đặt phòng thành công!',
                text: `${res.data.message || 'Chúc bạn có kỳ nghỉ vui vẻ!'}`,
                icon: 'success',
                confirmButtonText: 'OK',
                allowOutsideClick: false,  // Chặn click ra ngoài
                allowEscapeKey: false      // Chặn đóng bằng phím ESC
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/client/home');
                }
            });
        }

    } catch (error) {
        console.error("Đặt phòng thất bại: ", error.response ? error.response.data : error.message);
        await Swal.fire({
            title: 'Đặt phòng thất bại!',
            text: error.response ? error.response.data.message || 'Đã xảy ra lỗi không xác định.' : 'Lỗi không xác định.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        throw error;
    }
};



const fetchDiscounts = async (username) => {
    const res = await request({
        method: "GET",
        path: `api/discount/get-discount-account?username=${username}`
    });
    return res;
};

export { getDataListTypeRoom, bookingRoom, fetchDiscounts };