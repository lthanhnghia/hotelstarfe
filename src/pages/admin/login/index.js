import React, { useState } from 'react';
import './index.css';
import user_icon from '../../../assets/images/person.png';
import password_icon from '../../../assets/images/password.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { jwtDecode as jwt_decode } from "jwt-decode";
import Alert from '../../../config/alert';
const LoginAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [alertData, setAlertData] = useState(null);
  const handleLoginAdmin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/account/loginToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    passwords: password
                }),
            });
            const result = await response.json();
            if (result.code == 200) {
                Cookies.set("token", result.token, { expires: 6 / 24 });
                const decodedToken = jwt_decode(Cookies.get("token"));
                setAlertData({ type: result.status, title: result.message });
                if (decodedToken.role == 'Customer') {
                    setTimeout(() => {
                        navigate('/client/home');
                    }, 1500);
                } else if (decodedToken.role == 'Staff') {
                    
                    setTimeout(() => {
                        navigate('/employee/home');
                    }, 1500);
                } else if (decodedToken.role == 'HotelOwner') {
                    
                    setTimeout(() => {
                        navigate('/admin/home');
                    }, 1500);
                }
            } else {
                setAlertData({ type: result.status, title: result.message });
                setTimeout(() => {
                    setTimeout(() => {
                        window.location.href = "http://localhost:3000/login-admin";
                      }, 1700);
                }, 1500);
            }
        } catch (error) {
            console.error("Error posting data to API:", error);
        }

    }
 

    return (
        <div className='login-admin'>
            <div className='container'>
            <div className="header">
                <div className="text">Đăng Nhập Tài Khoản</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={user_icon} alt='User Icon' />
                    <input
                        type='text'
                        placeholder='Tên tài khoản'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input">
                    <img src={password_icon} alt='Password Icon' />
                    <input
                        type='password'
                        placeholder='Mật khẩu'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            {/* <div className="forgot-password">
                Quên mật khẩu?{' '}
                <span onClick={() => navigate('/admin/forgot-password')}>
                    Bấm vào đây!
                </span>
            </div> */}
            <div className="submit-container">
                <button className="submit" onClick={handleLoginAdmin}>
                    Đăng Nhập
                </button>
            </div>
            {alertData && <Alert type={alertData.type} title={alertData.title} />}
        </div>
        </div>
    );
};

export default LoginAdmin;
