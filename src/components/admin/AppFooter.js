import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4" style={{ marginTop: 0, paddingTop: 0 }}>
      <div>
        <a href="https://hotelstar.vercel.app//client/home" target="_blank" rel="noopener noreferrer">
          Khách Sạn HotelStars
        </a>
      </div>
      <div className="ms-auto">
        <span className="me-1">Vận hành bởi</span>
        <a href="https://hotelstar.vercel.app//admin/home" target="_blank" rel="noopener noreferrer">
          Hệ Thống Quản Lý Khách Sạn
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
