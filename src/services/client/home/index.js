import { request } from "../../../config/configApi";

const getCountAbout = async () => {
    const res = await request({
        method: "GET",
        path: "api/room/getCountRoom"
    });
    return res;
}

const getTypeRoomTop3 = async () => {
    const res = await request({
        method: "GET",
        path: "api/type-room/top3"
    });
    return res;
}

const getAllServiceHotel = async () => {
    const res = await request({
        method: "GET",
        path: "api/service-hotel/getAll",
    });
    return res;
}

const getDetailTypeRoom = async (id) => {
    const res = await request({
        method: "GET",
        path: `api/type-room/detail-type-room?id=${id}`
    });
    return res;
};

const getListRoom = async (page, size) => {
    try {
        const res = await request({
            method: "GET",
            path: `/api/type-room/find-all-type-room?page=${page}&size=${size}`
        });
        return res;  // Trả về dữ liệu phòng từ API
    } catch (error) {
        console.error("Error fetching room data:", error);
        throw error;  // Ném lỗi nếu có vấn đề xảy ra
    }
}


const getDetailListTypeRoom = async (roomId) => {
    const res = await request({
        method: "GET",
        path: `api/room/details?roomId=${roomId}`
    });
    return res;
}

const getFilterBooking = async (startDate, endDate, guestLimit, page, size) => {
    // Kiểm tra typeRoomID và log nó để đảm bảo giá trị đúng
    const validTypeRoomID = parseInt(sessionStorage.getItem("selectedTypeRoom")) || 0;
    console.log("startDate:", startDate, "endDate:", endDate, "guestLimit:", guestLimit, "typeRoomID:", validTypeRoomID);
    // Gọi API với giá trị chính xác của typeRoomID
    const res = await request({
        method: 'GET',
        path: `api/type-room/find-type-room?startDate=${startDate}&endDate=${endDate}&guestLimit=${guestLimit}&page=${page}&size=${size}&typeRoomID=${validTypeRoomID}`,
    });
    return res;
};

const getListRoomById = async (roomId) => {
    const res = request({
        method: 'GET',
        path: `api/room/list-room-id?roomId=${roomId}`
    });
    return res;
}

const getListTypeRoomId = async () => {
    const res = await request({
        method: 'GET',
        path: `api/type-room/getAll`
    });
    return res;
}

export {
    getCountAbout, getTypeRoomTop3, getAllServiceHotel,
    getDetailTypeRoom, getListRoom, getDetailListTypeRoom,
    getFilterBooking, getListRoomById, getListTypeRoomId
};