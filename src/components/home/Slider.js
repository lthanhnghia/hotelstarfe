import React, { useEffect, useState } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getListCustom } from "./Service/Index";

export default function Sliders() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };
  const [testimonial, setTestimonial] = useState([]);
  const defaultAvatar = "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg";
  const getList = async () => {
    try {
      const res = await getListCustom();
      setTestimonial(res);
    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    getList();
  }, []);
  return (
    <>
      <div
        className="container-xxl testimonial my-5 py-5 bg-dark wow zoomIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <div className="owl-carousel testimonial-carousel py-5">
            <Slider {...settings}>
              {testimonial && testimonial.length > 0 ? (
                testimonial.map((item, key) => (
                  <div
                    key={key}
                    className="testimonial-item position-relative bg-white rounded overflow-hidden"
                  >
                    <p>{item.content}</p>
                    <div className="d-flex align-items-center">
                      <img
                        className="img-fluid flex-shrink-0 rounded"
                        src={item.avatar || defaultAvatar}
                        style={{ width: "45px", height: "45px" }}
                      />
                      <div className="ps-3">
                        <h6 className="fw-bold mb-1">{item.fullName}</h6>
                      </div>
                    </div>
                    <i className="fa fa-quote-right fa-3x text-orange position-absolute end-0 bottom-0 me-4 mb-n1"></i>
                  </div>
                ))
              ) : ("")}

            </Slider>
          </div>
        </div>
      </div>
    </>
  );
}
