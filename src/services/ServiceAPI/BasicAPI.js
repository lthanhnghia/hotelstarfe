import axios from 'axios';

const PUBLIC = 'http://localhost:8080';

export const getDataFromAPI = async (endpoint) => {
    try {
        const response = await axios.get(`${PUBLIC}${endpoint}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};
export const postDataToAPI = async (endpoint, data) => {
    try {
        const response = await axios.post(`${PUBLIC}${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
        throw error;
    }
};

export const updateDataToAPI = async (endpoint, data) => {
    try {
        const response = await axios.put(`${PUBLIC}${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật dữ liệu:", error);
        throw error;
    }
};

export const deleteDataFromAPI = async (endpoint) => {
    try {
        const response = await axios.delete(`${PUBLIC}${endpoint}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa dữ liệu:", error);
        throw error;
    }
};
