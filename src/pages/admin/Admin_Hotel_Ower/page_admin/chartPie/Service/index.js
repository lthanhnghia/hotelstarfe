import { request } from "../../../../../../config/configApi";

const InfoRoomOccupancy = async (startDate, endDate) => {
    const res = await request({
        method: "GET",
        path: `/api/room/room-occupancy?startDate=${startDate}&endDate=${endDate}`
    });
    return res;
}

const InfoRoomUsage = async (startDate, endDate) => {
    const res = await request({
        method: 'GET',
        path: `/api/booking/room-usage?startDate=${startDate}&endDate=${endDate}`
    });
    return res;
}

export { InfoRoomOccupancy, InfoRoomUsage };