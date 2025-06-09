import { request } from "../../../config/configApi";

const sendEmailForgotPassword = async (email) => {
    const res = request({
        method: "POST",
        path: "api/account/sendEmail",
        data: {email},
        headers:{ 'Content-Type': 'application/json'}
    });
    return res;
}

export { sendEmailForgotPassword };
