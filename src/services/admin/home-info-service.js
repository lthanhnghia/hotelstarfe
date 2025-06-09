import axios from 'axios';
import {request} from '../../config/configApi';

const getProvinces = async () => {
    try {
        const res = await axios.get('https://provinces.open-api.vn/api/p/');
        return res.data;
    } catch (error) {
        console.error("Error fetching provinces:", error);
        throw error;
    }
};

const getDistrictsByProvince = async (provinceCode) => {
    try {
        const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        return res.data.districts;
    } catch (error) {
        console.error("Error fetching districts:", error);
        throw error;
    }
};

const getWardsByDistrict = async (districtCode) => {
    try {
        const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        return res.data.wards;
    } catch (error) {
        console.error("Error fetching wards:", error);
        throw error;
    }
};

const getHotel = async () => {
    const res = await request({
        method: "GET",
        path: "api/hotel/getHotel"
    });
    return res;
}
const getImageHotel = async () => {
    const res = await request({
        method: "GET",
        path: "/api/image/getAll"
    });
    return res;
}

const updateHotelNew = async (hotel) => {
    const res = await request({
        method: "PUT",
        path: "/api/hotel/update-hotel",
        data: hotel,
    });
    return res;
}

const saveImageHotel = async (imageName) => {
    const res = await request({
        method: "POST",
        path: "/api/image/add-image",
        data: imageName,
    });
    return res; // Hoặc res nếu bạn muốn trả về toàn bộ phản hồi
};
const updateImageHotel = async (image) => {
    const res = await request({
        method: "PUT",
        path: "/api/image/update-image",
        data: image,
    });
    return res;
}
const deleteImageHotel = async (imageIds) => {
    const res = await request({
        method: "DELETE", // Sử dụng phương thức DELETE
        path: "/api/image/delete", // Đường dẫn API tương ứng
        data: imageIds, // Gửi danh sách ID ảnh cần xóa
    });
    return res;
};

export { getProvinces, getDistrictsByProvince, getWardsByDistrict, 
        getHotel, getImageHotel, updateHotelNew, saveImageHotel, 
        updateImageHotel, deleteImageHotel };
