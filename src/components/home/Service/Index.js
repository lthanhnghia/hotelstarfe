import { request } from "../../../config/configApi";

const getListStaff = async () => {
    const res = await request({
        method: "GET",
        path: `api/list-controller/get-staff`
    });
    return res;
}

const getListCustom = async () => {
    const res = request({
        method: "GET",
        path: `/api/feedback/get-all-use`
    });
    return res;
}

export { getListStaff, getListCustom };