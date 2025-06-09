import React, { useEffect, useState } from "react";
import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./assets/css/admin/scss/style.scss";
import {
  Home,
  Booking,
  AboutUs,
  Contact,
  PageNotFound,
  RoomClient,
  Services,
  // Team,
  Testimonial,
} from "./pages/client/index";
import { Navigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from "jwt-decode";
import HomeAdmin from "./pages/admin/home";
import RoomAdmin from "./pages/admin/home/Room";
import RoomPriceManager from "./pages/admin/home/RoomPriceManager";
import InvoiceManagement from "./pages/admin/home/InvoiceManagement"
import BookingManger from "./pages/admin/home/BookingManger";
import Login from "./pages/account/login";
import Profile from "./pages/account/profile";
import EditRoom from "./pages/employee/edit-room";
import Homeemployee from "./pages/employee/home";
import ListReservation from "./pages/employee/list-reservation";
import FloorMap from "./pages/employee/floor_map";
import AccountClient from "./pages/admin/accountManagement/account-client";
import Accountemployee from "./pages/admin/accountManagement/account-employee";
import HotelInfo from "./pages/admin/hotel-info";
import PageBookRoom from "./pages/client/booking-room";
import Invoice from "./pages/client/invoice";
import RevenueReport from "./pages/admin/report-generation/revenue";
import ServicesPage from "./pages/admin/home/Services";
import ReservationReport from "./pages/admin/report-generation/reservation-report";
import RoomClassReport from "./pages/admin/report-generation/room-class-report";
import EmployeeReport from "./pages/admin/report-generation/employee-report";
import AmenitiesPage from "./pages/admin/home/Amenities";
// import LoginAdmin from "./pages/admin/login";
import Cookies from 'js-cookie';
import { Outlet } from "react-router-dom";
import LoginAdmin from "./pages/admin/login";
import ForgotPassword from "./pages/admin/ForgotPassword/ForgotPassword";
import VerifyOTP from "./pages/admin/ForgotPassword/OTPCode";
import ResetPassword from "./pages/admin/ForgotPassword/ResetPassword";
import ChangePassword from "./pages/admin/ChangePassword";
import ForgotPasswordEmail from "./pages/account/ForgotPassword/ForgotPassword";
import FloorPage from "./pages/admin/home/Floor";
import ListRoomEmployee from "./pages/employee/booking-offline";
import FeedbackPageComponent from "./pages/admin/Admin_Hotel_Ower/page_admin/feedback";
import FeedbackPage from "./pages/admin/home/Feedback";
import ProfileAdmins from "./pages/account/profile/my-profile/profileAdmin";
import ChangePasswordAdmin from "./pages/admin/ChangePassword/changePass";
function App() {

  const getUserRole = () => {
    try {
      const cookieToken = Cookies.get("token") ? Cookies.get("token") : null;
      const decodedToken = jwt_decode(cookieToken); // Decode token
      return decodedToken.role; // Return the roleName
    } catch (error) {
      console.error("Error decoding token:", error);
      return null; // Return null if there's an error
    }
  };
  const cookieTokens = Cookies.get("token") ? Cookies.get("token") : null;

  const ProtectedRoute = ({ element }) => {
    const token = Cookies.get("token") || null; // Get token from cookies
    const userRole = token ? getUserRole() : null; // Get the user's role if token exists
    const path = window.location.pathname; // Current path
    console.log(path)
    let hasAccess = false;

    // Kiểm tra quyền truy cập
    if (path.startsWith('/admin') || path.startsWith('/employee')) {
      // Cho phép HotelOwner truy cập /admin và /employee
      hasAccess = userRole === 'HotelOwner' || (userRole === 'Staff' && path.startsWith('/employee'));
    }

    if (!hasAccess) {
      return <Navigate to="/login-admin" />; // Redirect to home if access is not allowed
    }

    return element; // Render the component if access is allowed
  };
  useEffect(() => {
    // Kiểm tra nếu "status" đã tồn tại trong localStorage
    const storedStatus = localStorage.getItem("status");
    if (storedStatus === null) {
      // Nếu chưa tồn tại, đặt giá trị mặc định là false
      const isChecked = false;
      localStorage.setItem("status", JSON.stringify(isChecked));
    }
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" >
        <Route index element={<Navigate to="/client/home" />} />

        {/* Routes cho Client */}
        <Route path="/client" >
          <Route path="home" element={<Home />} />
          {/* <Route path="booking" element={<Booking />} /> */}
          {/* <Route path="testimonial" element={<Testimonial />} /> */}
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="rooms" element={<RoomClient />} />
          {/* <Route path="services" element={<Services />} /> */}
          <Route path="profile" element={<Profile />} />
          <Route path="booking-room" element={<PageBookRoom />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>


        {/* Routes cho Employee */}
        <Route path="/employee" element={<ProtectedRoute element={<Outlet />} allowedRoles={['Staff']} />}>
          <Route path="home" element={<Homeemployee />} />
          <Route path="edit-room" element={<EditRoom />} />
          <Route path="list-booking-room" element={<ListReservation />} />
          <Route path="Floor/:id" element={<FloorMap />} />
          <Route path="booking-offline" element={<ListRoomEmployee />} />
        </Route>

        {/* Routes cho Admin */}
        <Route path="/admin" element={<ProtectedRoute element={<Outlet />} allowedRoles={['HotelOwner']} />}>
          <Route path="home" element={<HomeAdmin />} />
          <Route path="room" element={<RoomAdmin />} />
          <Route path="booking-manager" element={<BookingManger />} />
          <Route path="discount" element={<RoomPriceManager />} />
          <Route path="invoice-room" element={<InvoiceManagement />} />
          <Route path="account-client" element={<AccountClient />} />
          <Route path="account-employee" element={<Accountemployee />} />
          <Route path="hotel-info" element={<HotelInfo />} />
          <Route path="revenue" element={<RevenueReport />} />
          <Route path="service" element={<ServicesPage />} />
          <Route path="amenities" element={<AmenitiesPage />} />
          <Route path="reservation-report" element={<ReservationReport />} />
          <Route path="room-class-report" element={<RoomClassReport />} />
          <Route path="employee-report" element={<EmployeeReport />} />
          <Route path="floor" element={<FloorPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="profiles" element={<ProfileAdmins />} />
          <Route path="changepassword" element={<ChangePasswordAdmin />} />
        </Route>

        <Route path="login-customer" element={<Login />} />
        <Route path="login-admin" element={<LoginAdmin />} />
        <Route path="forgot-password" element={<ForgotPasswordEmail />} />
        <Route path="otp-code" element={<VerifyOTP />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
    )
  );
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};
export default App;