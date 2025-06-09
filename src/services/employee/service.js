import { request } from "../../config/configApi";
import React from "react";

const serviceRoomBookingRoom = async (idBookingRoom) => {
    const res = await request({
        method: "GET",
        path: `api/booking-room-service-room/booking-room-id?bookingRoom=${idBookingRoom}`
    });
    return res;
}

const addServiceNew = async (models, bookingRoomId) => {
    const res = await request({
        method: "POST",
        path: `api/booking-room-service-room/post-service?bookingRoomId=${bookingRoomId}`,
        data: models
    });
    return res;
}

const bookingServiceRoom = async (id) => {
    const res = await request({
        method: "GET",
        path: `api/booking-room-service-room/service?bookingRoom=${id}`
    });
    return res;
}

export {serviceRoomBookingRoom,addServiceNew,bookingServiceRoom}