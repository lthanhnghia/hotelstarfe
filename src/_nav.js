import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilBuilding,
  cilLayers,
  cilPeople,
  cilBriefcase,
  cilClipboard,
  cilCash,
  cilRoom,
  cilCloud,
  cilStar,
  cilSpeech,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Tổng quan',
    to: '/admin/home',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Thông tin khách sạn',
    to: "/admin/hotel-info",
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Phòng & tầng',
    icon: <CIcon icon={cilRoom} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Loại phòng & phòng',
        to: '/admin/room',
      },
      {
        component: CNavItem,
        name: 'Tầng',
        to: '/admin/floor',
      },
      {
        component: CNavItem,
        name: 'Giảm giá',
        to: '/admin/discount',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Dịch vụ & Tiện nghi',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Dịch vụ',
        to: '/admin/service',
      },
      {
        component: CNavItem,
        name: 'Tiện nghi',
        to: '/admin/amenities',
      },
    ],
  },
  // {
  //   component: CNavGroup,
  //   name: 'Giao dịch',
  //   icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Đặt phòng',
  //       to: '/admin/booking-manager',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Hóa đơn',
  //       to: '/admin/invoice-room',
  //     },
  //   ],
  // },
  {
    component: CNavGroup,
    name: 'Quản lý tài khoản',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Khách hàng',
        to: '/admin/account-client',
      },
      {
        component: CNavItem,
        name: 'Nhân viên',
        to: '/admin/account-employee',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Quản lý đánh giá',
    to: '/admin/feedback',
    icon: <CIcon icon={cilSpeech} customClassName="nav-icon" />
  },
  {
    component: CNavGroup,
    name: 'Báo cáo',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Đặt phòng',
        to: '/admin/reservation-report',
      },
      {
        component: CNavItem,
        name: 'Doanh thu',
        to: '/admin/revenue',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Lễ tân',
    to: '/employee/home',
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
  },
]

export default _nav
