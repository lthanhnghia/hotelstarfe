import React from "react";
import { request } from "../../config/configApi";

const getAllService = async () => {
    const res = await request({
        method: "GET",
        path: `api/type-room-service/getAll`
    });
    return res;
}

export {getAllService};