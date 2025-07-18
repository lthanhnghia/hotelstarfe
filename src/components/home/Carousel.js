import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { carouselData } from "../data/Data";
import { getImageHotel } from "../../services/admin/home-info-service";
import Alert from "../../config/alert";
import img1 from "../../assets/imagess/imagehotel1.jpg";
import img2 from "../../assets/imagess/imagehotel2.jpg";
import img3 from "../../assets/imagess/imagehotel3.jpg";
import img4 from "../../assets/imagess/imagehotel4.jpg";
import img5 from "../../assets/imagess/imagehotel5.jpg";
import img6 from "../../assets/imagess/imagehotel6.jpg";
export default function Carousel() {
  const sliderRef = useRef(null);
  const [image] = useState([img1, img2, img3, img4, img5, img6]);
  const [alert, setAlert] = useState(null);
console.log("Danh sách ảnh:", image);
 
  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  
  return (
    <>
      <div className="container-fluid p-0 mb-5">
        {alert && <Alert type={alert.type} title={alert.title} />}
        <div
          id="header-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <Slider ref={sliderRef} {...settings}>
              {image.map((val, index) => (
                <div className="carousel-item" key={index}>
                  <img className="w-100" src={val} alt="Image" height={700} />
                  <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                    <div className="p-3" style={{ maxWidth: "700px" }}>
                      <h6 className="section-title text-white text-uppercase mb-3 animated slideInDown">
                        Cuộc sống xa hoa
                      </h6>
                      <h1 className="display-3 text-white mb-4 animated slideInDown">
                        Khám phá một khách sạn sang trọng
                      </h1>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            onClick={previous}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            onClick={next}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
}
