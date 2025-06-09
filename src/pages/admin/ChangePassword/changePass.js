import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, TextField } from '@mui/material';
import person_icon from '../../../assets/images/person.png';
import password_icon from '../../../assets/images/password.png';
import { request } from '../../../config/configApi';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import changpass from './changepassApi';
import { jwtDecode as jwt_decode } from "jwt-decode";
import Alert from '../../../config/alert';
const ChangePasswordAdmin = () => {
  // Define styles with unique class names
  const styles = {
    changePasswordContainer: {
        display: 'flex', // Sử dụng Flexbox
        justifyContent: 'center', // Căn giữa theo chiều ngang
        alignItems: 'center',
      padding: '10px 20px 15px 5px', // Thêm padding để tạo khoảng cách
      minHeight: '100vh', // Đảm bảo chiều cao tối thiểu
      fontFamily: 'Arial, sans-serif',
      margin: '10px 20px 15px 100px'
  },
    changePasswordCard: {
      backgroundColor: '#ffffff', // White card background
      padding: '10px',
      borderRadius: '10px', // Rounded corners
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Light shadow for a card effect
      width: '400px',
      textAlign: 'center',
    },
    changePasswordHeader: {
      color: '#FEA116', // Primary orange color
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    changePasswordUnderline: {
      width: '50px',
      height: '3px',
      backgroundColor: '#FEA116', // Primary orange color
      marginBottom: '20px',
      margin: '0 auto',
    },
    changePasswordInputs: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginBottom: '20px',
    },
    changePasswordInputContainer: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #FEA116', // Orange border
      borderRadius: '5px',
      padding: '10px',
    },
    changePasswordInput: {
      border: 'none',
      outline: 'none',
      marginLeft: '10px',
      flex: 1,
    },
    changePasswordSubmitContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
    changePasswordSubmitButton: {
      backgroundColor: '#FEA116', // Primary orange color
      color: '#ffffff', // White text for contrast
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      textAlign: 'center',
      outline: 'none', // Remove the default black border
      border: 'none',   // Ensure there's no visible border
    },
    changePasswordSubmitButtonHover: {
      backgroundColor: '#e69500', // Slightly darker shade for hover effect
    },
  };
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [alertData, setAlertData] = useState(null); // State to control alert
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors },
    clearErrors,
} = useForm({
    mode: "onBlur", // Xác thực khi mất tiêu điểm
});
const tokens = Cookies.get("token") || null;
useEffect(() => {
  if (tokens) {
    try {
      const decodedToken = jwt_decode(tokens);
      const extractedUsername = decodedToken?.username || '';
      setUsername(extractedUsername);
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('Invalid token. Please log in again.');
    }
  }
}, [tokens]);
const handleChangePassword = async (event) => {
  event.preventDefault();
  const isValid = await trigger(); // Trigger form validation

  if (!isValid) {
    // Stop if there are validation errors
    return;
  }

  const formData = getValues();
  const data = {
    username: username,
    password:formData.passwords,               // Use extracted username
    resetPassword: formData.password,   // New password
    confirmPassword:formData.configPassword ,  // Old password
    token:tokens
  };

  try {
    // Make sure the token is valid
    if (!tokens) {
      throw new Error('Token not found or invalid');
    }

    // Pass the data and token to the changpass function
    const response = await changpass(data, tokens);
    console.log(response)
    if (response && response.code === "200") {
      setAlertData({ type: response.status, title: response.message });
      reset(); // Reset form fields if needed
      setTimeout(() => {
        navigate('/client/home');
      }, 1700);
    } else {
      console.log('Failed to change password.');
    }
  } catch (error) {
    console.error('Error in changing password:', error);
  }
};

  
  return (
    <div style={styles.changePasswordContainer}>
      <div style={styles.changePasswordCard}>
        <div style={styles.changePasswordHeader}>
          Đổi mật khẩu mới
        </div>
        <div style={styles.changePasswordUnderline}></div>
        <div style={styles.changePasswordInputs}>
          <div style={styles.changePasswordInputContainer}>
            <img src={person_icon} alt="" />
            <input 
              type="text" 
              placeholder="Tên tài khoản" 
              style={styles.changePasswordInput} 
              value={username} // Bind the username state
              readOnly
            />
          </div>
          <div style={styles.changePasswordInputContainer}>
            <img src={password_icon} alt="" />
            <input 
              type="password" 
              placeholder="Nhập mật khẩu cũ" 
              style={styles.changePasswordInput} 
              {...register("passwords", {
                required: "Mật khẩu là bắt buộc",
                validate: {
                    minLength: (value) => value.length >= 6 || "Mật khẩu phải có ít nhất 6 ký tự",
                },
            })}
            />
          </div>
          {errors.passwords && <small style={{ textAlign: 'left', display: 'block' }} className="text-orange">{errors.passwords.message}</small>}
          <div style={styles.changePasswordInputContainer}>
            <img src={password_icon} alt="" />
            <input 
              type="password" 
              placeholder="Nhập mật khẩu mới" 
              style={styles.changePasswordInput} 
              {...register("password", {
                required: "Mật khẩu là bắt buộc",
                validate: {
                    minLength: (value) => value.length >= 6 || "Mật khẩu phải có ít nhất 6 ký tự",
                },
            })}
            required
            />
          </div>
          {errors.password && <small style={{ textAlign: 'left', display: 'block' }} className="text-orange">{errors.password.message}</small>}
         
          <div style={styles.changePasswordInputContainer}>
            <img src={password_icon} alt="" />
            <input 
              type="password" 
              placeholder="Xác nhận mật khẩu" 
              style={styles.changePasswordInput} 
              {...register("configPassword", {
                required: "Xác nhận mật khẩu là bắt buộc",
                validate: (value) =>
                    value === getValues("password") || "Mật khẩu và xác nhận mật khẩu không khớp",
            })}
            />
          </div>
          {errors.configPassword &&
            <small className="text-orange" style={{ textAlign: 'left', display: 'block' }} >{errors.configPassword.message}</small>
          }
        </div>
        <div style={styles.changePasswordSubmitContainer}>
          <button
            type="submit"
            style={{
              ...styles.changePasswordSubmitButton,
              ':hover': styles.changePasswordSubmitButtonHover
            }}
            onClick={handleChangePassword}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.changePasswordSubmitButtonHover.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.changePasswordSubmitButton.backgroundColor}
          >
            Lưu mật khẩu
          </button>
        </div>
      </div>
      {alertData && <Alert type={alertData.type} title={alertData.title} />}
    </div>
  );
}

export default ChangePasswordAdmin;
