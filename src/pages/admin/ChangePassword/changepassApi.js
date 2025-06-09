import React, { useState } from 'react';
import axios from 'axios';
import { request } from '../../../config/configApi';

const changpass = async (data, token) => {
  try {
    const res = await request({
      method: "PUT",
      path: "api/account/changepassword",
      data,    // Pass the data object here
      token,   // Pass the token here
    });
    return res;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error; // Hoặc xử lý lỗi theo cách bạn muốn
  }
};

export default changpass;