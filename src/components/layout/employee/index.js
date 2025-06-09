import React from 'react'
import { AppSidebar, AppFooter, AppHeader } from '../../employee/index';
import "../../../assets/css/employee/style.css";
import { Card } from 'react-bootstrap';
import CIcon from '@coreui/icons-react';

export default function Layoutemployee({ children, title, icons }) {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
         <h2 className='mx-5'><CIcon icon={icons} customClassName="nav-icon" style={{fontSize: "1.25rem", height: "2rem", marginBottom: "7px", color: "#171616"}}/> {title}</h2>
          <Card style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", margin: "38px", boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)' }}>
            {children}
          </Card>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

