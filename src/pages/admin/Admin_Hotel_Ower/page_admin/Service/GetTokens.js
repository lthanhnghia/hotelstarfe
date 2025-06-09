import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Thư viện để giải mã token JWT
import { request } from '../../../../../config/configApi';

// Custom Hook để lấy token
const useToken = () => {
    const [decodedToken, setDecodedToken] = useState(null);

    useEffect(() => {
        const token = getTokenFromCookie(); // Lấy token từ cookie
        console.log("Token from cookie:", token);
        if (token) {
            try {
                const decoded = jwtDecode(token); // Giải mã token
                console.log("Mã token của bạn là: ", decoded); // In ra token đã giải mã

                // Nếu giá trị trong token có dấu bằng, loại bỏ nó
                if (typeof decoded.id === "string") {
                    const cleanId = decoded.id.replace("=", ""); // Loại bỏ dấu '=' nếu có
                    decoded.id = cleanId;
                }

                setDecodedToken(decoded); // Cập nhật state với token đã giải mã
            } catch (error) {
                console.error('Error decoding JWT:', error);
                setDecodedToken(null); // Nếu có lỗi, đặt lại thành null
            }
        } else {
            console.error('Token not found in cookie');
            setDecodedToken(null); // Nếu không tìm thấy token, đặt lại thành null
        }
    }, []); // Chạy một lần khi component mount

    return decodedToken; // Trả về token đã giải mã
};

// Hàm lấy token từ cookie
const getTokenFromCookie = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`); // Thay "token" bằng tên cookie của bạn
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Không tìm thấy token
};

const top5TypeRom = async (filterOption) => {
    const res = request({
        method: "GET",
        path: `api/room/top-5-type-room?filterOption=${filterOption}`
    });
    return res;
}
export { useToken, top5TypeRom };
