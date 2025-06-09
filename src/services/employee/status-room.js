import { request } from "../../config/configApi"

const getStatusRoom = async (id) => {
    const res = await request({
        method: "GET",
        path: "/api/status-room/get-status-excluding/"+ id,
    });
    return res;
}

export {getStatusRoom};