import React, { useRef, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { ClipLoader } from "react-spinners"; // Import spinner từ react-spinners
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode as jwt_decode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { imageDb } from './Config';  // Đồng bộ với file Config.js
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 } from "uuid";
import { useForm } from 'react-hook-form';
import Alert from "../../../../config/alert";
import uploadProfiles from "./apiUpload";
const ProfileAdmins = () => {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [gender, setGender] = useState(true);
    const token = Cookies.get("token") ? Cookies.get("token") : null;
    const fileInputRef = useRef(null);
    const [user, setUser] = useState({
        avatar: "", // Avatar URL or file name
    });
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [preview, setPreview] = useState("");
    const [img, setImg] = useState('');
    const [updateImage, setUpdateImage] = useState(false);
    const navigate = useNavigate();
    const [alertData, setAlertData] = useState(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Cập nhật img
        if (file) {
            setImg(file)
            const imageUrl = URL.createObjectURL(file); // Get a temporary URL for the selected image
            setPreview(imageUrl); // Set preview image
            setUser((prevUser) => ({
                ...prevUser,
            }));
        }
    };
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
        clearErrors,
    } = useForm({
        mode: "onBlur", // Xác thực khi mất tiêu điểm
    });

    const handleLogin = async (event) => {
        event.preventDefault();
        const isValid = Object.keys(errors).length === 0; // Nếu không có lỗi, isValid sẽ là true

        if (!isValid) {
            return; // Nếu có lỗi, không làm gì cả và thoát khỏi hàm
        }
        let imagePath = avatar;
        if (updateImage && !img) {
            alert("Please select a file first.");
            return;
        }
        if (img) {
            try {
                const imgRef = ref(imageDb, `files/${v4()}`);
                console.log("Image Reference:", imgRef);

                // Upload image and get the download URL
                const snapshot = await uploadBytes(imgRef, img);
                console.log("Upload successful:", snapshot);

                imagePath = await getDownloadURL(imgRef);
                console.log("Image download URL:", imagePath);
            } catch (error) {
                console.error("Error uploading file:", error);
                return; // Stop further execution if image upload fails
            }
        } else {
            console.log("ảnh cũ: " + avatar)
        }



        // setLoading(true); // Bắt đầu loading
        // setTimeout(() => {
        //     setLoading(false); // Kết thúc loading sau 2 giây giả lập
        //     console.log(user); // In ra thông tin người dùng (có thể thay đổi)
        // }, 2000)
        const reviewData = {
            id: id,
            username: username, // Gửi email hoặc thông tin khác
            avatar: imagePath,
            email: email,
            phone: phone,
            gender: gender,
            fullname: fullname
        };
        console.log(reviewData);
        try {
            const response = await uploadProfiles(reviewData);
            console.log("API response:", response);

            if (response.code == "201") {
                Cookies.set("token", response.token, { expires: 6 / 24 });
                setAlertData({ type: response.status, title: response.message });
                // setTimeout(() => {
                //     window.location.href = "http://localhost:3000/admin/home";
                // }, 1700);
            } else {
                setAlertData({ type: response.status, title: response.message });
                navigate("/admin/home");
            }
        } catch (error) {
            console.error("Error fetching booking history:", error);
        }
    };


    useEffect(() => {

        if (token) {
            try {
                const decodedTokens = jwt_decode(token);
                console.log("id người dùng: " + decodedTokens.id);
                setId(decodedTokens.id || '');
                setUsername(decodedTokens.username || '');
                setFullname(decodedTokens.fullname || '');
                setEmail(decodedTokens.email || '');
                setPhone(decodedTokens.phone || '');
                setAvatar(decodedTokens.avatar || '');
                setGender(decodedTokens.gender === true ? true : false);
                console.log("avartar: " + decodedTokens.avatar);
                console.log("giới tính: " + decodedTokens.gender);
            } catch (error) {
                console.error("Lỗi giải mã token:", error);
            }
        }
    }, []);
    useEffect(() => {
        if (avatar) {
            console.log("Avatar updated to:", avatar); // Giá trị mới của avatar
            // Bạn có thể thực hiện hành động khác tại đây nếu cần
        }
    }, [avatar]);
    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
        >
            <div
                className="card shadow p-3"
                style={{ maxWidth: "600px", width: "100%" }}
            >
                <div className="card-body">
                    {alertData && <Alert type={alertData.type} title={alertData.title} />}
                    <h4 className="text-center mb-3">Thông tin cá nhân</h4>
                    <Form className="row g-2">
                        <div className="col-md-12">
                            <div className="text-center mb-3">
                                <img
                                    src={preview ? preview : avatar}
                                    alt="Avatar"
                                    className="rounded-circle"
                                    style={{ width: "120px", height: "120px" }}
                                />
                            </div>
                            <Form.Group
                                className="position-relative mb-3 text-center avata"
                                controlId="formAvatar"
                            >
                                <div
                                    className="btn "
                                    style={{ cursor: "pointer", display: "inline-block" }}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Chọn hình ảnh
                                </div>
                                <input
                                    type="file"
                                    style={{ display: "none" }}
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="inputUsername" className="form-label">
                                Tên tài khoản:
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                {...register("username", { required: "Tài khoản là bắt buộc" })}
                                id="inputUsername"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (errors.username) clearErrors("username");
                                }}
                                disabled
                            />
                            {errors.username && (
                                <small className="text-orange">{errors.username.message}</small>
                            )}
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="inputFullname" className="form-label">
                                Họ và tên:
                            </label>
                            <input
                                type="text"
                                {...register("fullname", { required: "Họ Tên là bắt buộc" })}
                                className="form-control form-control-sm"
                                id="inputFullname"
                                value={fullname}
                                onChange={(e) => {
                                    setFullname(e.target.value);
                                    if (errors.fullname) clearErrors("fullname");
                                }}
                            />
                            {errors.fullname && (
                                <small className="text-orange">{errors.fullname.message}</small>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputEmail" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                {...register("email", { required: "Email là bắt buộc" })}
                                className="form-control form-control-sm"
                                id="inputEmail"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) clearErrors("email");
                                }}
                            />
                            {errors.email && (
                                <small className="text-orange">{errors.email.message}</small>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPhone" className="form-label">
                                Phone
                            </label>
                            <input
                                type="text"
                                {...register("phone", { required: "Số điện thoại là bắt buộc" })}
                                className="form-control form-control-sm"
                                id="inputPhone"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    if (errors.phone) clearErrors("phone");
                                }}
                            />
                            {errors.phone && (
                                <small className="text-orange">{errors.phone.message}</small>
                            )}
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="inputGender" className="form-label" style={{ marginRight: "40px" }}>
                                Giới tính
                            </label>

                            <div className="form-check form-check-inline" >
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    id="inlineRadio1"
                                    value="true"
                                    checked={gender === true}
                                    onChange={() => setGender(true)}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio1">
                                    Nam
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    id="inlineRadio2"
                                    value="false"
                                    checked={gender === false}
                                    onChange={() => setGender(false)}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio2">
                                    Nữ
                                </label>
                            </div>
                        </div>
                        <div className="col-12 text-center">
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm"
                                onClick={handleLogin}
                            >
                                Cập nhật
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
    
};



export default ProfileAdmins;