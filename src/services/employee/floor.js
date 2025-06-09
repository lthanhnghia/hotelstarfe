import { request } from "../../config/configApi";

const getAllFloor = async () => {
    const res = await request({
        method: "GET",
        path: "api/floor/getAll"
    });
    return res;
}

const getBookingRoomByRoom = async (roomId, statusId, token) => {
    const res = await request({
        method: "GET",
        path: `api/booking-room/room?roomId=${roomId}&statusId=${statusId}`,
        token: token
    });
    return res;
}

export {getAllFloor, getBookingRoomByRoom}