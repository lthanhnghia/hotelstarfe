import React from "react";
import { request } from "../../config/configApi";

const addInvoice = async (data, token) => {
    const res = await request({
        method: "POST",
        path: `api/invoice/add`,
        data: data,
        token: token
    });
    return res;
}

const maintenanceScheduleSuccess = async (data) => {
    const res = await request({
        method: "POST",
        path: `api/invoice/maintenance`,
        data: data
    });
    return res;
}

export {addInvoice,maintenanceScheduleSuccess};