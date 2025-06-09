import { request } from "../../config/configApi";

const getRoomByFloorId = async (id) => {
    const res = await request({
        method: "GET",
        path: "api/room/FloorById/" + id
    });
    return res;
}
const updateStatusRoom = async (room,token) => {
    const res = await request({
        method: "PUT",
        path: "api/room/update-active",
        data: room,
        token: token
    });
    return res;
}

const getAllRoom = async (startDate, endDate, guestLimit = 1, page = 0, size) => {
    const res = await request({
        method: "GET",
        path: `/api/room?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}&guestLimit=${guestLimit}`
    });
    return res;
}

const getAllRooms = async () => {
    const res = await request({
        method: "GET",
        path: `/api/room/getAll`
    });
    return res;
} 

export {getRoomByFloorId, updateStatusRoom, getAllRoom,getAllRooms}