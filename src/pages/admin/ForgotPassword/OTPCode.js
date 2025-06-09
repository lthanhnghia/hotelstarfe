import React, { useState, useRef } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import "./otpcode.css";
import { Button } from "@mui/material";
import otp_icon from '../../../assets/images/otp.png';

const VerifyOTP = () => {
  const navigate = useNavigate();
  // const [otp, setOtp] = useState(Array(6).fill(''));
  // const inputRefs = useRef([]);

  // const navigate = useNavigate();

  // const verifyOtp = async (e) => {
  //   e.preventDefault();
  //   const generatedOTP = sessionStorage.getItem("generatedOTP");
  //   const email = sessionStorage.getItem("email");

  //   try {
  //     const response = await axios.post("api/verify-otp", {
  //       otp: otp.join(''),
  //       generatedOTP,
  //       email,
  //     });
  //     toast.success(response.data || "OTP đã được xác nhận!");
  //     navigate("/resetPassword");
  //   } catch (error) {
  //     toast.error(error.response?.data || "Đã xảy ra lỗi!");
  //   }
  // };

  // const handleOtpChange = (event, index) => {
  //   const { value } = event.target;
  //   const newOtp = [...otp];
    
  //   if (value.match(/[0-9]/)) {
  //     newOtp[index] = value;
  //     setOtp(newOtp);
      
  //     // Move to the next input field if not the last one
  //     if (index < otp.length - 1) {
  //       inputRefs.current[index + 1].focus();
  //     }
  //   } else if (value === '') {
  //     // Handle backspace
  //     newOtp[index] = '';
  //     setOtp(newOtp);

  //     if (index > 0) {
  //       inputRefs.current[index - 1].focus();
  //     }
  //   }
  // };

  return (
    <div className='container'>
            <div className="header">
                <div className="text">Xác thực email</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={otp_icon} alt='' />
                    <input type='number' placeholder='Nhập mã OTP'/>
                </div>
                {/* <div className="input">
                    <img src={password_icon} alt='' />
                    <input type='password' placeholder='Mật khẩu'/>
                </div> */}
            </div>
            <div className="submit-container">
                <div className="submit"onClick={() => navigate('/admin/reset-password')}>
                    Xác nhận
                </div>
            </div>
    </div>
  );
};
export default VerifyOTP;
