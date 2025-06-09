import React, { useState } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, TextField, Pagination } from '@mui/material';
import email_icon from '../../../assets/images/email.png';
import { request } from "../../../config/configApi";

const ForgotPassword = () => {
   
    // Define styles with the updated color scheme
    const styles = {
      forgotPasswordContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#fff7f0', // Light background for contrast
        fontFamily: 'Arial, sans-serif',
      },
      forgotPasswordCard: {
        backgroundColor: '#ffffff', // White card background
        padding: '30px',
        borderRadius: '10px', // Rounded corners
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Light shadow for a card effect
        width: '400px',
        textAlign: 'center',
      },
      forgotPasswordHeader: {
        color: '#FEA116', // Updated to the new orange color
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
      },
      forgotPasswordUnderline: {
        width: '50px',
        height: '3px',
        backgroundColor: '#FEA116', // Updated to the new orange color
        marginBottom: '20px',
        margin: '0 auto',
      },
      forgotPasswordInputs: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '20px',
      },
      forgotPasswordInputContainer: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #FEA116', // Updated to the new orange color
        borderRadius: '5px',
        padding: '10px',
      },
      forgotPasswordInput: {
        border: 'none',
        outline: 'none',
        marginLeft: '10px',
        flex: 1,
      },
      forgotPasswordSubmitContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
      },
      forgotPasswordSubmitButton: {
        backgroundColor: '#FEA116', // Updated to the new orange color
        color: '#ffffff', // White text for contrast
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      forgotPasswordSubmitButtonHover: {
        backgroundColor: '#e69500', // Slightly darker shade for hover effect
      },
    };
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
  
    return (
      <div style={styles.forgotPasswordContainer}>
        <div style={styles.forgotPasswordCard}>
          <div style={styles.forgotPasswordHeader}>
            Khôi phục tài khoản
          </div>
          <div style={styles.forgotPasswordUnderline}></div>
          <div style={styles.forgotPasswordInputs}>
            <div style={styles.forgotPasswordInputContainer}>
              <img src={email_icon} alt='' />
              <input 
                type='email' 
                placeholder='Email' 
                style={styles.forgotPasswordInput} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div style={styles.forgotPasswordSubmitContainer}>
            <div 
              style={styles.forgotPasswordSubmitButton}
              onClick={() => navigate('/admin/otp-code')}
            >
              Gửi mã OTP
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ForgotPassword;
