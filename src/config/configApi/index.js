import axios from "axios";
import Swal from "sweetalert2";
import {initializeApp} from "firebase/app";
import {getStorage} from 'firebase/storage';
import { Cookies } from "react-cookie";
export const BASE_URL = "http://localhost:8080/";

const request = async ({ method = "GET", path = "", data = {}, headers = {}, token = "" }) => {
  const cookie = new Cookies();
  const tokenCookie = cookie.get("token");
  // if(token || token !== tokenCookie){
  //   window.location.reload();
  // }
  try {
    const res = await axios({
      method,
      baseURL: BASE_URL,
      url: path,
      data,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    const errorData = error?.response?.data;
    const errorMessages = errorData?.errors || [errorData?.message || "Đã xảy ra lỗi."];

    Swal.fire({
      icon: "error",
      title: "",
      html: `<ul>${errorMessages.map(msg => `<li>${msg}</li>`).join('')}</ul>`,
      toast: true,
      position: "top-end",
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return null;
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyC-yTelb8SWfOKdNBmbbtEqPpEVQjSuJPc",
  authDomain: "myprojectimg-164dd.firebaseapp.com",
  projectId: "myprojectimg-164dd",
  storageBucket: "myprojectimg-164dd.appspot.com",
  messagingSenderId: "369775366834",
  appId: "1:369775366834:web:3062b759c0a71362722fab"
};

const app = initializeApp(firebaseConfig);
const imageDb = getStorage(app);
export {request, imageDb};
