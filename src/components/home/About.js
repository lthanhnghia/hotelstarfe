import React, { useEffect, useState } from "react";
import { getImageHotel } from "../../services/admin/home-info-service";
import Alert from "../../config/alert";
import { getCountAbout } from "../../services/client/home";
import { useNavigate } from "react-router-dom";

export default function About() {
  const [image, setImage] = useState([]);
  const [alert, setAlert] = useState(null);
  const [countReven, setCountReven] = useState(null);
  const location = useNavigate();
  useEffect(() => {
    handleImageHotel();
    handleCountReven();
  }, [])
  const handleImageHotel = async () => {
    try {
      const data = await getImageHotel();
      if (!data) {
        setAlert({ type: "error", title: "Lỗi không tải được dữ liệu" });
      } else {
        setImage(data);
      }
    } catch (error) {
      setAlert({ type: "error", title: error });
    }
  }

  const handleCountReven = async () => {
    try {
      const data = await getCountAbout();
      if (data) {
        setCountReven(data);
      } else {
        setAlert({ type: "error", title: "Lỗi không tải được dữ liệu" });
      }
    } catch (error) {
      setAlert({ type: "error", title: error });
    }
  }

  const handleOnclickNavigate = () => {
    location("/client/about");
    window.scrollTo(0, 0);
  }
  return (
    <>
      <div className="container-xxl py-5">
        {alert && <Alert type={alert.type} title={alert.title} />}
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h6 className="section-title text-start text-orange text-uppercase">
                Về chúng tôi
              </h6>
              <h1 className="mb-4">
                Chào mừng đến{" "}
                <span className="text-orange text-uppercase">Stars Hotel</span>
              </h1>
              <p className="mb-4">
                Khách sạn Start Hotel – nơi nghỉ dưỡng hoàn hảo với tiện nghi hiện đại, không gian sang trọng và vị trí lý tưởng,
                mang đến cho bạn trải nghiệm tuyệt vời.
              </p>
              <div className="row g-3 pb-4">
                <div className="col-sm-4 wow fadeIn" data-wow-delay="0.1s">
                  <div className="border rounded p-1">
                    <div className="border rounded text-center p-4">
                      <i className="fa fa-hotel fa-2x text-orange mb-2"></i>
                      <h2 className="mb-1" data-toggle="counter-up">
                        {countReven?.totalRoom}
                      </h2>
                      <p className="mb-0">Phòng</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 wow fadeIn" data-wow-delay="0.1s">
                  <div className="border rounded p-1">
                    <div className="border rounded text-center p-4">
                      <i className="fa fa-users fa-2x text-orange mb-2"></i>
                      <h2 className="mb-1" data-toggle="counter-up">
                        {countReven?.countStaff}
                      </h2>
                      <p className="mb-0">Nhân viên</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 wow fadeIn" data-wow-delay="0.1s">
                  <div className="border rounded p-1">
                    <div className="border rounded text-center p-4">
                      <i className="fa fa-users-cog fa-2x text-orange mb-2"></i>
                      <h2 className="mb-1" data-toggle="counter-up">
                        {countReven?.countCustomers}
                      </h2>
                      <p className="mb-0">Khách hàng</p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary py-3 px-5 mt-2" onClick={handleOnclickNavigate}>
                Khám phá
              </button>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6 text-end">
                  <img
                    className="img-fluid rounded w-75 wow zoomIn"
                    data-wow-delay="0.1s"
                    src={image[0]?.imageName}
                    style={{ marginTop: "25%" }}
                  />
                </div>
                <div className="col-6 text-start">
                  <img
                    className="img-fluid rounded w-100 wow zoomIn"
                    data-wow-delay="0.3s"
                    src={image[1]?.imageName}
                  />
                </div>
                <div className="col-6 text-end">
                  <img
                    className="img-fluid rounded w-50 wow zoomIn"
                    data-wow-delay="0.5s"
                    src={image[2]?.imageName}
                  />
                </div>
                <div className="col-6 text-start">
                  <img
                    className="img-fluid rounded w-75 wow zoomIn"
                    data-wow-delay="0.7s"
                    src={image[3]?.imageName}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
