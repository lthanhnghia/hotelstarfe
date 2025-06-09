import { Cookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

// Hàm lấy token từ cookie
const getCookieIsToken = () => {
    const cookies = new Cookies();
    const token = cookies.get("token"); // Lấy giá trị token từ cookie
    if (!token) {
        console.error("Token không tồn tại trong cookie.");
        return null;
    }
    return token;
};

// Hàm giải mã token
const decodeToken = () => {
    const token = getCookieIsToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token); // Giải mã token
        return decoded;
    } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return null; // Trả về null nếu token không hợp lệ
    }
};

// Hàm lấy role từ token đã giải mã
const getUserRoleFromToken = () => {
    const decoded = decodeToken();
    if (decoded && decoded.phone) {
        return decoded.phone; // Trả về role nếu tồn tại
    }
    return null; // Nếu không có role, trả về null
};


export { decodeToken, getUserRoleFromToken };
