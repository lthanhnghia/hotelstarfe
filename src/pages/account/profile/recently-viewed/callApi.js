import React, { useState } from 'react';
import axios from 'axios';
import { request } from '../../../../config/configApi';

const HistoryBookings = async (accountId) => {
    try {
      const res = await request({
        method: "GET", // Phương thức HTTP GET
        path: `/api/booking/booking-history-account?accountId=${accountId}`, // Truyền accountId thẳng trên URL
        //headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header nếu cần
      });
      return res; // Trả về kết quả từ API
    } catch (error) {
      console.error("Error fetching booking history:", error);
      throw error; // Ném lỗi ra nếu cần
    }
  };
  
  export default HistoryBookings;