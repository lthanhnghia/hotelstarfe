import React from "react";
import { socialIcons } from "../data/Data";
import { Link } from "react-router-dom";
import  { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
export default function SocialIcons() {
  const [username, setUsername] = useState(null);
  useEffect(() => {
    const user = Cookies.get("token")? Cookies.get("token"):null; // Giả sử cookie lưu tên người dùng là 'username'
    setUsername(user);
}, []);
  return (
    <>
      <div className="col-lg-3 px-5">
        <div className="d-inline-flex align-items-center py-2">
          <nav className="navbar navbar-expand-lg bg-dark navbar-dark p-3 p-lg-0">
            <div className="navbar-nav mr-auto py-0">
              {username ? (   <Link to={`/client/profile`} className="nav-link" style={{marginRight: '0'}}>Tài khoản </Link>):(   <Link to={`/login-customer`} className="nav-link" style={{marginRight: '0'}}>Đăng ký / Đăng nhập </Link>)}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
