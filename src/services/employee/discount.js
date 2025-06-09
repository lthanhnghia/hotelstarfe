import { request } from "../../config/configApi";

const discountBooking = async (discountName) => {
    const res = await request({
        method: "GET",
        path: `api/discount/discount-name-booking?discount=${discountName}`
    });
    return res;
}

export {discountBooking};