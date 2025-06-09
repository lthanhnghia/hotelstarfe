import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ForgotPassword.css';
import { FaEnvelope, FaSpinner, FaCheckCircle } from 'react-icons/fa'; // Import icon từ React Icons
import { useForm } from 'react-hook-form';
import { sendEmailForgotPassword } from '../Service';
import Swal from 'sweetalert2';

const ForgotPasswordEmail = () => {
    const { register, handleSubmit, formState: { errors } } = useForm(); // Sử dụng react-hook-form
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const res = await sendEmailForgotPassword(data.email);
            if (res?.message === 'Email sent successfully') {
                setTimeout(() => {
                    setIsLoading(false);
                    setMessage('Email đặt lại mật khẩu đã được gửi!');
                }, 2000);
            } else {
                throw new Error('Không thể gửi email');
            }
        } catch (error) {
            setIsLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi xảy ra',
                html: '<p>Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.</p>',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="forgot-password-wrapper">
            <div className="forgot-password-container">
                <h2 className="text-center mb-4">Quên mật khẩu</h2>
                <p className="text-muted text-center mb-4">
                    Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
                </p>
                <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label">
                        <FaEnvelope className="icon" /> Email
                    </label>
                    <input
                        type="email"
                        id="emailInput"
                        className={`form-control custom-input ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Nhập email của bạn"
                        {...register('email', {
                            required: 'Email là bắt buộc.',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Email không hợp lệ.',
                            },
                        })}
                    />
                    {errors.email && (
                        <div className="invalid-feedback">
                            {errors.email.message}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="btn btn-primary w-100 custom-btn"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <FaSpinner className="spinner-icon" /> Đang gửi...
                        </>
                    ) : (
                        'Gửi email'
                    )}
                </button>
                {message && (
                    <div className="alert alert-success mt-3 text-center">
                        <FaCheckCircle className="icon-success" /> {message}
                    </div>
                )}
            </div>
        </form>
    );
};

export default ForgotPasswordEmail;
