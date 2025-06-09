import { request } from "../../config/configApi";

const createServiceHotel = async (data,token) => {
    const res = await request({
        method: "POST",
        path: "api/service-hotel/post-data-service-hotel",
        data: data,
        token: token
    });
    return res;
}

const updateServiceHotel = async (data,token) => {
    const res = await request({
        method: "PUT",
        path: "api/service-hotel/update-data-service-hotel",
        data: data,
        token: token
    });
    return res;
}
const deleteServiceHotel = async (id ,token) => {
    const res = await request({
        method: "DELETE",
        path: "api/service-hotel/delete-data-service-hotel/" + id,
        token: token
    });
    return res;
}

const getAllServicePackage = async () => {
    const res = await request({
        method: "GET",
        path: "api/service-package/getAll"
    });
    return res;
}
const createServicePackage = async (data) => {
    const res = await request({
        method: "POST",
        path: "api/service-package/post-service-package",
        data: data
    });
    return res;
}
const updateServicePackage = async (data) => {
    const res = await request({
        method: "PUT",
        path: "api/service-package/put-service-package",
        data: data
    });
    return res;
}
const deleteServicePackage = async (id) => {
    const res = await request({
        method: "DELETE",
        path: "api/service-package/delete-service-package/" + id
    });
    return res;
}

const getAllRoomService = async () => {
    const res = await request({
        method: "GET",
        path: "api/service-room/getAll"
    });
    return res;
}

const createRoomService = async (data, token) => {
    const res = await request({
        method: "POST",
        path: "api/service-room/add-service-room",
        data: data,
        token: token
    });
    return res;
}

const updateRoomService = async (id, data, token) => {
    const res = await request({
        method: "PUT",
        path: "api/service-room/update-service-room/" + id,
        data: data,
        token: token
    });
    return res;
}
const deleteRoomService = async (id, token) => {
    const res = await request({
        method: "DELETE",
        path: "api/service-room/delete-service-room/" + id,
        token: token
    });
    return res;
}

const getAllTypeRoomService = async () => {
    const res = await request({
        method: "GET",
        path: "api/type-room-service/getAll"
    });
    return res;
}
const createTypeRoomService = async (data, token) => {
    const res = await request({
        method: "POST",
        path: "api/type-room-service/create",
        data: data,
        token: token
    });
    return res;
}

const updateTypeRoomService = async (id, data, token) => {
    const res = await request({
        method: "PUT",
        path: "api/type-room-service/update/" + id,
        data: data,
        token: token
    });
    return res;
}

const deleteTypeRoomService = async (id, token) => {
    const res = await request({
        method: "DELETE",
        path: "api/type-room-service/delete/" + id,
        token: token
    });
    return res;
}
export {updateServiceHotel,createServiceHotel,deleteServiceHotel,
        getAllServicePackage,createServicePackage,updateServicePackage,
        deleteServicePackage,getAllRoomService,getAllTypeRoomService,
        updateRoomService,createRoomService,deleteRoomService,updateTypeRoomService,
        createTypeRoomService,deleteTypeRoomService};