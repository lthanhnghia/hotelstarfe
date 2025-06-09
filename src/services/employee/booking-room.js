import React from "react"; 
import { request } from "../../config/configApi";

const getByIdBookingRoom = async (id) => {
    const res = await request({
        method: "GET",
        path: `api/booking-room/getById/${id}`
    });
    return res;
}

const addBookingRoomServiceRoom = async (serviceRoom) => {
    const res = await request({
        method: "POST",
        path: 'api/booking-room-service-room',
        data: serviceRoom
    });
    return res;
}

const updateQuantity = async (id, service) => {
    const res = await request({
        method: "PUT",
        path: `api/booking-room-service-room/${id}`,
        data: service
    });
    return res;
}

const deleteService = async (id) => {
    const res = await request({
        method: "DELETE",
        path: `api/booking-room-service-room/${id}`
    });
    return res;
}

const getByRoom = async (idRoom) => {
    const res = await request({
        method: "GET",
        path: `api/booking-room/getByRoom/${idRoom}`
    });
    return res;
}

export {getByIdBookingRoom,addBookingRoomServiceRoom,updateQuantity,deleteService,getByRoom};