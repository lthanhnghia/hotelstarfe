import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Form, InputGroup, Button, Dropdown, Row, Col } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import { getListTypeRoomId } from '../../services/client/home';

export default function Booking() {
  const [checkinDate, setCheckinDate] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState(null);
  const [guestDropdownVisible, setGuestDropdownVisible] = useState(false);
  const [adultCount, setAdultCount] = useState(1);
  const [guestSummary, setGuestSummary] = useState("1 khách");
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [typeRoomOptions, setTypeRoomOptions] = useState([]); // Lưu danh sách loại phòng
  const [selectedTypeRoom, setSelectedTypeRoom] = useState(0);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const getListTypeRoomName = async () => {
    try {
      const res = await getListTypeRoomId();
      setTypeRoomOptions(res);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getListTypeRoomName();
  }, []);

  // Format ngày về yyyy-MM-dd
  const formatDateToYYYYMMDD = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Hàm toggle dropdown
  const toggleGuestDropdown = () => {
    setGuestDropdownVisible(!guestDropdownVisible);
  };

  // Thay đổi số người lớn
  const changeCount = (type, value) => {
    if (type === "adult") {
      setAdultCount((prevCount) => Math.max(1, prevCount + value)); // Tối thiểu 1 người lớn
    }
  };

  // Áp dụng lựa chọn và cập nhật summary
  const applyGuestSelection = () => {
    setGuestSummary(`${adultCount} khách`);
    setGuestDropdownVisible(false);
  };

  const handleSubmit = useCallback(async () => {
    if (!checkinDate) {
      setIsCheckinOpen(true); // Mở lịch chọn ngày nhận khách
      return;
    }

    if (!checkoutDate || (checkinDate && checkoutDate <= checkinDate)) {
      setIsCheckoutOpen(true); // Mở lịch chọn ngày trả khách
      return;
    }

    const filterData = {
      checkIn: formatDateToYYYYMMDD(checkinDate),
      checkOut: formatDateToYYYYMMDD(checkoutDate),
      guest: adultCount,
      typeRoomID: selectedTypeRoom,
    };

    sessionStorage.setItem("valueFillter", JSON.stringify(filterData));

    // Bật trạng thái loading
    setIsLoading(true);

    // Điều hướng sau khi đảm bảo mọi thứ đã sẵn sàng
    navigate("/client/rooms", { state: filterData });

    // Tắt trạng thái loading sau khi điều hướng
    setIsLoading(false);
  }, [checkinDate, checkoutDate, adultCount, selectedTypeRoom, navigate]);
  
  // Xử lý khi thay đổi ngày nhận phòng
  const handleCheckinChange = (date) => {
    setCheckinDate(date);

    // Nếu ngày trả phòng không hợp lệ, tự động điều chỉnh
    if (checkoutDate && date >= checkoutDate) {
      const correctedDate = new Date(date);
      correctedDate.setDate(correctedDate.getDate() + 1); // Ngày trả phòng phải ít nhất 1 ngày sau ngày nhận phòng
      setCheckoutDate(correctedDate);
    }
  };

  // Xử lý khi thay đổi ngày trả phòng
  const handleCheckoutChange = (date) => {
    if (checkinDate && date <= checkinDate) {
      const correctedDate = new Date(checkinDate);
      correctedDate.setDate(correctedDate.getDate() + 1); // Tự động sửa ngày trả phòng
      setCheckoutDate(correctedDate);
    } else {
      setCheckoutDate(date);
    }
  };
  return (
    <>
      <div
        className="container-fluid booking pb-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <div className="bg-white shadow" style={{ padding: "35px" }}>
            <div className="row g-2">
              <div className="col-md-10">
                <div className="row g-2">
                  <div className="col-md-3">
                    <label htmlFor="typeRoom" className="form-label">Loại phòng</label>
                    <select
                      id="typeRoom"
                      className="form-select"
                      value={selectedTypeRoom}
                      onChange={(e) => setSelectedTypeRoom(e.target.value)} // Lưu ID của loại phòng
                    >
                      <option value={0}>Tất cả</option>
                      {typeRoomOptions.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.typeRoomName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="checkin" className="form-label">Nhận phòng</label>
                    <div className="input-group flex-nowrap">
                      <span className="input-group-text"><i className="bi bi-calendar-minus"></i></span>
                      <DatePicker
                        selected={checkinDate}
                        onChange={(date) => {
                          handleCheckinChange(date);
                          setIsCheckinOpen(false); // Đóng lịch sau khi chọn ngày
                        }}
                        className="form-control mt-0"
                        placeholderText="Chọn ngày nhận khách"
                        dateFormat="dd/MM/yyyy"
                        open={isCheckinOpen} // Kiểm soát hiển thị lịch
                        onClickOutside={() => setIsCheckinOpen(false)} // Đóng lịch khi click bên ngoài
                        minDate={new Date()} // Ngày nhận phòng phải sau hoặc bằng ngày hiện tại
                        onFocus={() => setIsCheckinOpen(true)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="checkout" className="form-label">Trả phòng</label>
                    <div className="input-group flex-nowrap">
                      <span className="input-group-text"><i className="bi bi-calendar-minus"></i></span>
                      <DatePicker
                        selected={checkoutDate}
                        onChange={(date) => {
                          handleCheckoutChange(date);
                          setIsCheckoutOpen(false); // Đóng lịch sau khi chọn ngày
                        }}
                        className="form-control mt-0"
                        placeholderText="Chọn ngày trả khách"
                        dateFormat="dd/MM/yyyy"
                        open={isCheckoutOpen} // Kiểm soát hiển thị lịch
                        onClickOutside={() => setIsCheckoutOpen(false)} // Đóng lịch khi click bên ngoài
                        minDate={checkinDate ? new Date(checkinDate).setDate(new Date(checkinDate).getDate() + 1) : new Date()} // Ngày trả phòng phải lớn hơn ngày nhận phòng
                        onFocus={() => setIsCheckoutOpen(true)} // Mở lịch khi nhấn vào input
                      />
                    </div>
                  </div>
                  <Col md={3} className="position-relative">
                    <Form.Group controlId="guests">
                      <Form.Label>Số khách</Form.Label>
                      <InputGroup className="flex-nowrap">
                        <InputGroup.Text>
                          <i className="bi bi-person"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder={guestSummary}
                          readOnly
                          onClick={toggleGuestDropdown}
                          style={{ background: '#fff' }}
                        />
                      </InputGroup>
                    </Form.Group>

                    {guestDropdownVisible && (
                      <Dropdown.Menu
                        show
                        align="end"
                        className="p-3 border rounded shadow-sm guest-dropdown"
                        style={{ position: 'absolute', top: '100%', zIndex: 1 }}
                      >
                        <Dropdown.Item as="div" className="guest-option">
                          <Row className="d-flex justify-content-between align-items-center mb-2">
                            <Col>Số lượng người ở</Col>
                            <Col className="d-flex justify-content-end">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => changeCount('adult', -1)}
                              >
                                -
                              </Button>
                              <span className="mx-2">{adultCount}</span>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => changeCount('adult', 1)}
                              >
                                +
                              </Button>
                            </Col>
                          </Row>
                        </Dropdown.Item>

                        <Button variant="primary" onClick={applyGuestSelection} className="w-100">
                          Xong
                        </Button>
                      </Dropdown.Menu>
                    )}
                  </Col>
                </div>
              </div>
              <div className="col-md-2" style={{ marginTop: "40px" }}>
                <button className="btn btn-primary w-100" onClick={handleSubmit} style={{ height: '37px' }}>Tìm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}