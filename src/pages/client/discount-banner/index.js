import React, { useState, useEffect } from 'react';
import './index.css';
import { request } from '../../../config/configApi';
import Cookies from 'js-cookie';
import Alert from '../../../config/alert';

const DiscountBanner = ({ id_account }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [discount, setDiscount] = useState(null);
  const [alert, setAlert] = useState(null);
  const [collapsed, setCollapsed] = useState(false); // Trạng thái "thu gọn"
  const token = Cookies.get('token');

  const fetchDiscount = async () => {
    try {
      const response = await request({
        method: 'GET',
        path: `/api/discount/get-discount-by-date?id_account=${id_account}`,
      });
      if (response) {
        setDiscount(response);
      } else {
        setDiscount(null);
      }
    } catch (error) {
      console.error('Lỗi khi lấy khuyến mãi:', error);
    }
  };

  const calculateTimeLeft = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const localEnd = new Date(end.getTime() + end.getTimezoneOffset() * 60000);
    const difference = localEnd - now;

    if (difference <= 0) {
      return 'Khuyến mãi đã kết thúc!';
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
    }
    return `${hours} giờ ${minutes} phút ${seconds} giây`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDiscount();
      if (discount?.endDate) {
        const timeLeft = calculateTimeLeft(discount.endDate);
        setTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [discount]);

  if (!discount) {
    return null;
  }

  const handleClick = async () => {
    try {
      const formData = {
        id: 0,
        discount_id: discount.id,
        account_id: id_account,
      };
      const response = await request({
        method: 'POST',
        path: '/api/discount-accounts/add',
        data: formData,
        headers: {
          'Content-Type': 'application/json',
        },
        token: token,
      });
      if (response && response.code === '200') {
        setAlert({ type: 'success', title: 'Nhận giảm giá thành công!' });
      }
    } catch (error) {
      console.error('Error while adding type room: ', error);
    }
  };

  return (
    <>
      {alert && <Alert type={alert.type} title={alert.title} />}
      {collapsed ? (
        // Hiển thị khi đã thu gọn
        <div className="promotion-bubble" onClick={() => setCollapsed(false)}>
          🎉
        </div>
      ) : (
        // Hiển thị khối khuyến mãi đầy đủ
        <div className="promotion-banner">
          <div className="promotion-header">
            <div className="promotion-header">
              <button className="collapse-button" onClick={() => setCollapsed(true)} title="Thu nhỏ">
                X
              </button>
            </div>

          </div>
          <div className="promotion-content">
            <h5>🎉{discount?.discountName}🎉</h5>
            <span style={{ fontSize: '0.8rem' }}>{timeLeft}</span>
            <p>
              Giảm giá lên đến <strong>{discount?.percent}%</strong> tại <strong>Start Hotel</strong>!
            </p>
            <div className="d-flex">
              <button className="promotion-button ms-auto" onClick={handleClick}>
                Nhận Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiscountBanner;
