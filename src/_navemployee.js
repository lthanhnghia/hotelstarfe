import React, { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilList,
  cilBuilding,
  cilLayers,
  cilStream,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
import { getAllFloor } from './services/employee/floor';

export const createNavData = async () => {
  const floors = await getAllFloor(); // Lấy dữ liệu từ API
  if (!Array.isArray(floors)) {
    console.error("Floors data is not an array:", floors);
    return []; // Trả về mảng rỗng nếu không phải mảng
  }

  const floorItems = floors.map(floor => ({
    component: CNavItem,
    name: `${floor.floorName}`,
    to: `/employee/Floor/${floor.id}`,
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  }));

  return [
    {
      component: CNavItem,
      name: 'Sơ đồ lưới',
      to: '/employee/home',
      icon: <CIcon icon={cilStream} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Danh sách đặt phòng',
      to: '/employee/list-booking-room',
      icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    },
    {
      component: CNavGroup,
      name: 'Sơ đồ tầng',
      icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
      items: floorItems,
    },
  ];
};

