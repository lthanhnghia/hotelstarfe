import React, { useEffect, useState } from 'react';
import { CChartBar } from '@coreui/react-chartjs';
import "./style.css";
import { getStatisticsAll } from '../../../../services/admin/reservation';

const RevenueChart = ({ booking, startDate, endDate }) => {
  const [selectedValue, setSelectedValue] = useState(); // Giá trị mặc định là "1"
  const [invoice, setInvoice] = useState([]);

  useEffect(() => {
    const handleInvoice = async () => {
      const data = await getStatisticsAll();
      setInvoice(data);
    }

    handleInvoice();
  },[invoice]);
  const handleChange = (event) => {
    setSelectedValue(event.target.value); // Cập nhật giá trị state
  };
  const getDateLabels = (startDate, endDate) => {
    const labels = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Lặp qua từng ngày trong khoảng thời gian từ startDate đến endDate
    while (start <= end) {
      labels.push(start.toLocaleDateString()); // Thêm ngày vào mảng nhãn
      start.setDate(start.getDate() + 1); // Di chuyển đến ngày tiếp theo
    }

    return labels;
  };
  // Hàm để lọc dữ liệu theo ngày hoặc giờ và đảm bảo các cột không có dữ liệu sẽ có giá trị 0
  const getFilteredData = () => {
    if (selectedValue) {
      const today = new Date();
      let filteredBooking = [];
      let labels = [];
      let revenueData = [];

      switch (selectedValue) {
        case "1": // Hôm nay
          filteredBooking = invoice.filter(row => {
            const bookingDate = new Date(row.bookingDate);
            return bookingDate.getDate() === today.getDate() && bookingDate.getMonth() === today.getMonth() && bookingDate.getFullYear() === today.getFullYear();
          });

          // Tạo nhãn theo giờ trong ngày
          labels = Array.from({ length: 24 }, (_, index) => `${index}:00`); // Nhãn từ 0h đến 23h
          revenueData = labels.map((label, index) => {
            const hourData = filteredBooking.filter(row => new Date(row.bookingDate).getHours() === index);
            return hourData.length > 0 ? hourData.reduce((sum, row) => sum + parseInt(row.totalRevenue), 0) : 0;
          });
          break;

        case "2": // Hôm qua
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          filteredBooking = invoice.filter(row => {
            const bookingDate = new Date(row.bookingDate);
            return bookingDate.getDate() === yesterday.getDate() && bookingDate.getMonth() === yesterday.getMonth() && bookingDate.getFullYear() === yesterday.getFullYear();
          });

          // Tạo nhãn theo giờ trong ngày
          labels = Array.from({ length: 24 }, (_, index) => `${index}:00`);
          revenueData = labels.map((label, index) => {
            const hourData = filteredBooking.filter(row => new Date(row.bookingDate).getHours() === index);
            return hourData.length > 0 ? hourData.reduce((sum, row) => sum + parseInt(row.totalRevenue), 0) : 0;
          });
          break;

        case "3": // 7 ngày qua
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          filteredBooking = invoice.filter(row => new Date(row.bookingDate) >= sevenDaysAgo);

          // Tạo nhãn theo ngày
          labels = Array.from({ length: 7 }, (_, index) => {
            const date = new Date();
            date.setDate(today.getDate() - (7 - index));
            return date.toLocaleDateString();
          });

          revenueData = labels.map((label, index) => {
            const dayData = filteredBooking.filter(row => new Date(row.bookingDate).toLocaleDateString() === label);
            return dayData.length > 0 ? dayData.reduce((sum, row) => sum + parseInt(row.totalRevenue), 0) : 0;
          });
          break;

        case "4": // Tháng này
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          filteredBooking = invoice.filter(row => new Date(row.bookingDate) >= startOfMonth);

          // Tạo nhãn theo ngày trong tháng
          const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
          labels = Array.from({ length: daysInMonth }, (_, index) => `${index + 1}/${today.getMonth() + 1}`);

          revenueData = labels.map((label, index) => {
            const dayData = filteredBooking.filter(row => new Date(row.bookingDate).getDate() === index + 1);
            return dayData.length > 0 ? dayData.reduce((sum, row) => sum + parseInt(row.totalRevenue), 0) : 0;
          });
          break;

        case "5": // Tháng trước
          const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          filteredBooking = invoice.filter(row => {
            const bookingDate = new Date(row.bookingDate);
            return bookingDate >= startOfLastMonth && bookingDate <= endOfLastMonth;
          });

          // Tạo nhãn theo ngày trong tháng trước
          const lastMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
          labels = Array.from({ length: lastMonthDays }, (_, index) => `${index + 1}/${today.getMonth()}`);

          revenueData = labels.map((label, index) => {
            const dayData = filteredBooking.filter(row => new Date(row.bookingDate).getDate() === index + 1);
            return dayData.length > 0 ? dayData.reduce((sum, row) => sum + parseInt(row.totalRevenue), 0) : 0;
          });
          break;

        case "6": // Năm nay
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          filteredBooking = invoice.filter(row => new Date(row.bookingDate) >= startOfYear);

          // Tạo nhãn theo tháng trong năm
          labels = Array.from({ length: 12 }, (_, index) => `${index + 1}`);
          revenueData = labels.map((label, index) => {
            const monthData = filteredBooking.filter(row => new Date(row.bookingDate).getMonth() === index);
            return monthData.length > 0 ? monthData.reduce((sum, row) => sum + parseInt(row.totalRevenue), 0) : 0;
          });
          break;

        case "7": // Năm trước
          const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1); // 1 Jan năm trước
          const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31); // 31 Dec năm trước

          filteredBooking = invoice.filter(row => {
            const bookingDate = new Date(row.bookingDate);
            console.log(bookingDate);
            return bookingDate >= startOfLastYear && bookingDate <= endOfLastYear; // Kiểm tra xem bookingDate có trong năm trước không
          });
          
          // Tạo nhãn theo tháng trong năm trước
          labels = Array.from({ length: 12 }, (_, index) => `${index + 1}`);
          revenueData = labels.map((label, index) => {
            const monthData = filteredBooking.filter(row => new Date(row.bookingDate).getMonth() === index);
            return monthData.length > 0 ? monthData.reduce((sum, row) => sum + parseInt(row.totalRevenue), 0) : 0;
          });
          break;

        default:
          break;
      }

      return { labels, revenueData };
    } else {
      const labels = getDateLabels(startDate, endDate);

      // Lọc và tính toán doanh thu cho từng ngày trong labels
      const revenueData = labels.map((label) => {
        // Lọc các bản ghi booking trong khoảng thời gian từ startDate đến endDate và có ngày bookingDate trùng với label
        const dayData = booking.filter((row) => {
          const bookingDate = new Date(row.bookingDate);
          return bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate) && bookingDate.toLocaleDateString() === label;
        });

        return dayData.length > 0
          ? dayData.reduce((sum, row) => sum + parseInt(row.totalRevenue), 0)
          : 0; // Nếu không có dữ liệu cho ngày, gán giá trị 0
      });

      return { labels, revenueData };
    }

  };

  const { labels, revenueData } = getFilteredData(); // Lấy dữ liệu đã lọc

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '20px auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      border: '2px solid #ddd',
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
      backgroundColor: '#fff',
    }}>
      <div className="col-12 col-md-6 text-end"> {/* Phần chọn ngày */}
        <select
          className="form-select form-select-sm w-slot"
          aria-label=".form-select-sm example"
          value={selectedValue} // Truyền giá trị state vào đây
          onChange={handleChange} // Sự kiện thay đổi
        >
          <option value="">--chọn thời gian--</option>
          <option value="3">7 ngày qua</option>
          <option value="4">Tháng này</option>
          <option value="5">Tháng trước</option>
          <option value="6">Năm nay</option>
          <option value="7">Năm trước</option>
        </select>
      </div>
      <CChartBar
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Doanh thu',
              backgroundColor: '#42A5F5',
              data: revenueData,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return value.toLocaleString('vi-VN'); // Định dạng số thành kiểu Việt Nam
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default RevenueChart;
