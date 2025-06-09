import React from 'react'
import { AppSidebar, AppFooter, AppHeader } from '../../../components/admin/index'

export default function LayoutAdmin({ children }) {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          {children}
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

