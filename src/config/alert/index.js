import React, { useEffect } from "react";
import Swal from "sweetalert2";

const Alert = ({ type, title, position = "top-end" }) => {
  useEffect(() => {
    if (!type || !title) return;

    const Toast = Swal.mixin({
      toast: true,
      position: position, // Sử dụng prop position
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: type,
      title: title,
    });
  }, [type, title, position]); // Thêm position vào dependency array

  return null;
};


export default Alert;
