import { request } from "../../config/configApi";

const addCustomer = async (data, idBookingRoom) => {
    const res = await request({
        method: "POST",
        path: `api/customer-info/add?idBookingRoom=${idBookingRoom}`,
        data: data
    });
    return res;
}

const updateCustomer = async (id, data, idBookingRoom) => {
    const res = await request({
        method: "PUT",
        path: `api/customer-info/update/${id}?bookingRoomId=${idBookingRoom}`,
        data: data
    });
    return res;
}
const deleteCustomer = async (idCustomer, idBookingRoom) => {
    const res = await request({
        method: "DELETE",
        path:`/api/booking-infomation?idCustomer=${idCustomer}&idBookingRoom=${idBookingRoom}`
    });
    return res;
}

export {addCustomer,updateCustomer,deleteCustomer};