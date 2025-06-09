import axios from 'axios';

const PUBLIC = 'http://localhost:8080';

// Lấy JWT token từ localStorage (hoặc từ bất kỳ nơi nào bạn lưu trữ token)
export const getToken = () => {
    return localStorage.getItem('token');  // 'token' là key mà bạn đã dùng để lưu JWT token
};

// Hàm lấy dữ liệu từ API
export const getDataFromAPI = async (endpoint) => {
    try {
        const token = getToken();  // Lấy token
        const response = await axios.get(`${PUBLIC}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Thêm JWT token vào header
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};

// Hàm gửi dữ liệu tới API (POST)
export const postDataToAPI = async (endpoint, data) => {
    try {
        const token = getToken();
        const response = await axios.post(`${PUBLIC}${endpoint}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,  // Thêm JWT token vào header
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
        throw error;
    }
};

// Hàm cập nhật dữ liệu (PUT)
export const updateDataToAPI = async (endpoint, data) => {
    try {
        const token = getToken();
        const response = await axios.put(`${PUBLIC}${endpoint}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,  // Thêm JWT token vào header
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật dữ liệu:", error);
        throw error;
    }
};

// Hàm xóa dữ liệu (DELETE)
export const deleteDataFromAPI = async (endpoint) => {
    try {
        const token = getToken();
        const response = await axios.delete(`${PUBLIC}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Thêm JWT token vào header
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa dữ liệu:", error);
        throw error;
    }
};
