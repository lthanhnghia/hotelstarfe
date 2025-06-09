import React, { useState, useEffect } from 'react';
import Heading from "../../components/common/Heading";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LayoutClient from "../../components/layout/cilent";
export default function Booking() {
  const [checkinDate, setCheckinDate] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState(null);

  return (
    <LayoutClient>
      <Heading heading="ĐẶT PHÒNG" title="Trang chủ" subtitle="Đặt phòng" />
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title text-center text-orange text-uppercase">Room Booking</h6>
            <h1 className="mb-5">Book A <span className="text-orange text-uppercase">Luxury Room</span></h1>
          </div>
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6 text-end">
                  <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.1s" src="/assets/img/about-1.jpg" style={{ marginTop: "25%" }} />
                </div>
                <div className="col-6 text-start">
                  <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.3s" src="/assets/img/about-2.jpg" />
                </div>
                <div className="col-6 text-end">
                  <img className="img-fluid rounded w-50 wow zoomIn" data-wow-delay="0.5s" src="/assets/img/about-3.jpg" />
                </div>
                <div className="col-6 text-start">
                  <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.7s" src="/assets/img/about-4.jpg" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="wow fadeInUp" data-wow-delay="0.2s">
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="name" placeholder="Your Name" />
                        <label for="name">Your Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input type="email" className="form-control" id="email" placeholder="Your Email" />
                        <label for="email">Your Email</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group flex-nowrap">
                        <span className="input-group-text"><i className="bi bi-calendar-minus"></i></span>
                        <DatePicker
                          selected={checkinDate}
                          onChange={date => setCheckinDate(date)}
                          className="form-control mt-0"
                          placeholderText="Chọn ngày"
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group flex-nowrap">
                        <span className="input-group-text"><i className="bi bi-calendar-minus"></i></span>
                        <DatePicker
                          selected={checkoutDate}
                          onChange={date => setCheckoutDate(date)}
                          className="form-control mt-0"
                          placeholderText="Chọn ngày"
                          dateFormat="dd/MM/yyyy"
                          minDate={checkinDate ? new Date(checkinDate).setDate(new Date(checkinDate).getDate() + 1) : new Date()}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select className="form-select" id="select1">
                          <option value="1">Adult 1</option>
                          <option value="2">Adult 2</option>
                          <option value="3">Adult 3</option>
                        </select>
                        <label for="select1">Select Adult</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select className="form-select" id="select2">
                          <option value="1">Child 1</option>
                          <option value="2">Child 2</option>
                          <option value="3">Child 3</option>
                        </select>
                        <label for="select2">Select Child</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <select className="form-select" id="select3">
                          <option value="1">Room 1</option>
                          <option value="2">Room 2</option>
                          <option value="3">Room 3</option>
                        </select>
                        <label for="select3">Select A Room</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea className="form-control" placeholder="Special Request" id="message" style={{ height: "100px" }}></textarea>
                        <label for="message">Special Request</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-3" type="submit">Book Now</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutClient>
  );
}
