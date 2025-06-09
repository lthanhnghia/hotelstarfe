import React, { useRef, useState } from 'react';
import banner from '../../../assets/images/banner5.jpg';
import phuQuoc from '../../../assets/images/phuQuoc8.jpg';
import './index.css';
import { jwtDecode as jwt_decode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { GoogleLogin } from '@react-oauth/google';
import { ClipLoader } from "react-spinners"; // Import spinner từ react-spinners
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';

const AuthForm = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [username, setUsername] = useState('');
    const [usernames, setUsernames] = useState('');

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSignUpClick = () => {
        setIsSignUp(true);
    };

    const handleSignInClick = () => {
        setIsSignUp(false);
    };
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
    const navigate = useNavigate();
    const handleLoginSuccess = async (credentialResponse) => {
        const tokenGG = credentialResponse.credential;
        console.log(tokenGG);
        // Gửi token lên API
        setLoading(true); // Bắt đầu loading
        try {
          const response = await fetch('http://localhost:8080/api/account/getTokenGG', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email: tokenGG, // Gửi email hoặc thông tin khác
              }),
          });
      
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json(); // Phân tích phản hồi JSON
          if(data.token == null){
            setLoading(false); // Kết thúc loading sau 2 giây giả lập
            toast.error("Đăng Nhập thất bại,email đã tồn tại");
          }
          Cookies.set("token", data.token, { expires:  6 /24 }); 
          const tokens =  Cookies.get("token");
          const decodedTokenCookie = jwt_decode(tokens);
          
          const decodedToken = jwt_decode(data.token);
          console.log("Decoded Token:", decodedToken.role.roleName);
          
          if(decodedToken.role == 'Customer'){
            setLoading(false); // Kết thúc loading sau 2 giây giả lập
            toast.success("Đăng Nhập thành công!");
            setTimeout(() => {
                navigate('/client/home');
            }, 1500);
          }else if(decodedToken.role == 'Staff'){
            setLoading(false); // Kết thúc loading sau 2 giây giả lập
            toast.success("Đăng Nhập thành công!");
            setTimeout(() => {
                navigate('/employee/home');
            }, 1500);
          }else if(decodedToken.role =='HotelOwner'){
            setLoading(false); // Kết thúc loading sau 2 giây giả lập
            toast.success("Đăng Nhập thành công!");
            setTimeout(() => {
            navigate('/admin/home');
            }, 1500);
          }
      } catch (error) {
          console.error("Error posting data to API:", error);
      }
    };
    const handleLoginRegister = async (event) => {
        event.preventDefault();
        const isValid = await trigger(); // Trigger kiểm tra toàn bộ form

        if (!isValid) {
            // Nếu có lỗi, dừng lại và không gọi API
            return;
        }
        setLoading(true);

        try {
            const payload = {
                username: username,
                email: email,
                phone: phone,
                fullname: fullname,
                passwords: getValues("password"), // Ensure password.current is defined
            };
            console.log("Request payload:", payload); // Log payload for inspection

            const response = await fetch('http://localhost:8080/api/account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.code == 201) {
                setLoading(false); // Bắt đầu loading
                toast.success("Đăng Ký thành công!");
                setTimeout(() => {
                    reset();
                }, 800);

            } else {
                setLoading(false);
                toast.error(result.message);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            console.error("Error posting data to API:", error);
        }
    }
    const handleLoginSimple = async (event) => {
        event.preventDefault();
        console.log("đã zo thành công");
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/account/loginToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: usernames,
                    passwords: getValues("passwords")
                }),
            });


            const result = await response.json();


            if (result.code == 200) {
                setLoading(false); // Bắt đầu loading
                console.log('User updated successfully:', result);
                console.log(result.token);
                Cookies.set("token", result.token, { expires: 6 / 24 });
                const decodedToken = jwt_decode(Cookies.get("token"));
                console.log("Decoded Token:", decodedToken.role.roleName);

                if (decodedToken.role == 'Customer') {
                    setLoading(false); // Kết thúc loading sau 2 giây giả lập
                    toast.success("Đăng Nhập thành công!");
                    setTimeout(() => {
                        navigate('/client/home');
                    }, 1500);
                } else if (decodedToken.role == 'Staff') {
                    setLoading(false); // Kết thúc loading sau 2 giây giả lập
                    toast.success("Đăng Nhập thành công!");
                    setTimeout(() => {
                        navigate('/employee/home');
                    }, 1500);
                } else if (decodedToken.role == 'HotelOwner') {
                    setLoading(false); // Kết thúc loading sau 2 giây giả lập
                    toast.success("Đăng Nhập thành công!");
                    setTimeout(() => {
                        navigate('/admin/home');
                    }, 1500);
                }
            } else {
                setLoading(false);
                toast.error("Đăng Nhập thất bại!")
            }
        } catch (error) {
            console.error("Error posting data to API:", error);
        }

    }

    const handleOnclickForgot = () => {
        navigate("/forgot-password");
    }
    return (
        <div className='login'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
                closeButton={false} // Bỏ nút đóng
            />
            <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
                <div className="form-container sign-up-container">
                    <form style={{ background: '#ffd1a3' }}>
                        <h2 style={{ marginBottom: '20px' }}>Đăng Ký Tài Khoản</h2>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <input type="text" className="form-control" {...register("username", { required: "Tài Khoản không được rỗng" })}
                                    placeholder="Tên tài khoản" name="username" required
                                    onChange={(e) => {
                                        setUsername(e.target.value)
                                        if (errors.username) {
                                            clearErrors("username");
                                        }
                                    }} />
                                {errors.username && <small className="text-danger" style={{ textAlign: 'left', display: 'block' }}>{errors.username.message}</small>}
                            </div>

                            <div className="col-md-6">
                                <input type="text" className="form-control"   {...register("fullname", { required: "Họ Tên là bắt buộc" })}
                                    placeholder="Họ và tên" name="fullname" required onChange={(e) => {
                                        setFullname(e.target.value)
                                        if (errors.fullname) {
                                            clearErrors("fullname");
                                        }
                                    }} />
                                {errors.fullname && <small className="text-danger" style={{ textAlign: 'left', display: 'block' }}>{errors.fullname.message}</small>}
                            </div>
                            <div className="col-md-6">
                                <input type="email" className="form-control"  {...register("email", {
                                    required: "Email là bắt buộc", pattern: {
                                        value:
                                            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                                        message: "Email không hợp lệ",
                                    },
                                })}
                                    placeholder="Email" name="email" required onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (errors.email) {
                                            clearErrors("email");
                                        }
                                    }} />
                                {errors.email && <small className="text-danger" style={{ textAlign: 'left', display: 'block' }}>{errors.email.message}</small>}
                            </div>
                            <div className="col-md-6">
                                <input type="text"  {...register("phone", {
                                    required: "Số điện thoại là bắt buộc", pattern: {
                                        value: /^(0[1-9][0-9]{8})$/,
                                        message: "Số điện thoại bắt đầu 0 và có 10 số",
                                    },
                                })} className="form-control" placeholder="Số điện thoại" name="phone" required
                                    onChange={(e) => {
                                        setPhone(e.target.value)
                                        if (errors.phone) {
                                            clearErrors("phone");
                                        }
                                    }} />
                                {errors.phone && <small className="text-danger" style={{ textAlign: 'left', display: 'block' }} >{errors.phone.message}</small>}
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Mật khẩu"
                                    name="password"

                                    {...register("password", {
                                        required: "Mật khẩu là bắt buộc",
                                        validate: {
                                            minLength: (value) => value.length >= 6 || "Mật khẩu phải có ít nhất 6 ký tự",
                                        },
                                    })}
                                    required
                                />
                                {errors.password && <small style={{ textAlign: 'left', display: 'block' }} className="text-danger">{errors.password.message}</small>}
                            </div>
                            <div className="col-md-6">
                                <input type="password" className="form-control" placeholder="Xác nhận mật khẩu" name="confirmPassword"
                                    {...register("configPassword", {
                                        required: "Xác nhận mật khẩu là bắt buộc",
                                        validate: (value) =>
                                            value === getValues("password") || "Mật khẩu và xác nhận mật khẩu không khớp",
                                    })} />
                                {errors.configPassword &&
                                    <small className="text-danger" style={{ textAlign: 'left', display: 'block' }} >{errors.configPassword.message}</small>
                                }
                            </div>
                        </div>
                        <button type="submit" onClick={handleLoginRegister} className="btn btn-primary mt-3" style={{ width: '100%' }} >Đăng ký</button>
                    </form>
                </div>

                <div className="form-container sign-in-container">
                    <form style={{ background: '#ffd1a3' }}>
                        <h1>Đăng Nhập Tài Khoản</h1>
                        <div className="row g-3" style={{ width: '80%' }}>
                            <div className="col-md-12">
                                <input type="text" className="form-control" placeholder="Tài Khoản" name="fullname" required onChange={(e) => setUsernames(e.target.value)} />
                            </div>
                            <div className="col-md-12">
                                <input type="password" className="form-control" placeholder="Mật Khẩu" name="passwords"
                                    {...register("passwords")} // Đăng ký input mà không cần kiểm tra lỗi
                                    required />
                            </div>
                            <button

                                onClick={handleOnclickForgot}
                                style={{
                                    display: 'inline-block',
                                    margin: '10px 0',
                                    fontSize: '13px',
                                    color: '#007bff',
                                    textDecoration: 'none',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'color 0.3s'
                                }}
                            >
                                Quên mật khẩu?
                            </button>
                            <button type="submit" className="btn btn-primary mt-3" onClick={handleLoginSimple} style={{ width: '100%' }} >Đăng nhập</button>
                            <span>Hoặc sử dụng tài khoản của bạn</span>
                            <div className="d-flex gap-2 mt-3 justify-content-center">
                                <a className="btn d-flex align-items-center" style={{background: '#ffff' }} href="#" role="button">
                                    <i className="bi bi-google me-2"></i><GoogleLogin onSuccess={handleLoginSuccess} />
                                </a>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <div className="card" style={{ width: '25rem', background: 'none', border: 'none' }}>
                                <img src={phuQuoc} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">Nêu có tài khoản</h5>
                                    <p className="card-text"><i className="bi bi-check-lg"></i> Bạn có thể đăng nhập.</p>
                                    <button style={{ width: '100%' }} className="btn btn-primary" onClick={handleSignInClick}>Đăng nhập</button>
                                </div>
                            </div>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <div className="card" style={{ width: '25rem', background: 'none', border: 'none' }}>
                                <img src={phuQuoc} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">Chào mừng đến với Stars Booking</h5>
                                    <p className="card-text">
                                        <i className="bi bi-check-lg"></i> Bạn có thể tiết kiệm hơn nữa với giá cho thành viên từ trang web đối tác của chúng tôi<br />
                                        <i className="bi bi-check-lg"></i> Dễ dàng xem lại nơi lưu trú đã lưu từ bất cứ thiết bị nào.
                                    </p>
                                    <button style={{ width: '100%' }} className="btn btn-primary" onClick={handleSignUpClick}>Đăng ký</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading && (
                <div style={overlayStyle}>
                    <ClipLoader color="#3498db" loading={loading} size={50} />
                </div>
            )}
        </div>

    );
};
const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Nền trắng với độ mờ
    zIndex: 1000, // Để overlay nằm trên các thành phần khác
};
export default AuthForm;