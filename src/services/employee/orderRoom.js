import { request } from "../../config/configApi";

const addBookingOffline = async (orderData) => {
    const response = await request({
        method: 'POST',
        path: 'api/booking/booking-offline',
        data: orderData,
    });

    return response;
};

export { addBookingOffline };