import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from '../../../assets/images/admin/images/avatars/8.jpg';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { jwtDecode as jwt_decode } from "jwt-decode";

const AppHeaderDropdown = () => {

  const navigate = useNavigate();
  const [alertDatas, setAlertDatas] = useState(null);
  const [account, setAccount] = useState(null);
  useEffect(() => {
    if (Cookies.get('token')) {
      try {
        const decodedTokens = jwt_decode(Cookies.get('token'));
        setAccount(decodedTokens);
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Bạn có muốn đăng xuất?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy"
    });

    if (result.isConfirmed) {
      setAlertDatas({ type: "success", title: "Đăng xuất thành công" });
      setTimeout(() => {
        Cookies.remove('token'); // Nếu bạn dùng `js-cookie` để quản lý cookie
        // Chuyển hướng về trang đăng nhập
        navigate('/login-admin');
      }, 1200);
    }

  };

  return (
    <>
      {alertDatas && <Alert type={alertDatas.type} title={alertDatas.title} />}
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <img
            src={account?.avatar}
            alt="Avatar"
            className="rounded-circle"
            style={{ width: "40px", height: "40px" }}
          />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">{account?.username}</CDropdownHeader>
          <CDropdownItem href="#">
            <CIcon icon={cilUser} className="me-2" />
            Tài khoản
          </CDropdownItem>

          <CDropdownDivider />
          <CDropdownItem onClick={handleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Đăng xuất
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export default AppHeaderDropdown
