import React, { useEffect, useState } from "react";
import CommonHeading from "../common/CommonHeading";
import RoomDetailModal from "../../pages/client/Room/modal-room";
import { getDetailTypeRoom, getTypeRoomTop3 } from "../../services/client/home";
import Alert from "../../config/alert";
import { Button } from "react-bootstrap";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const [showModal, setShowModal] = useState(false);
  const [roomItem, setRoomItem] = useState({});
  const [typeRoom, setTypeRoom] = useState([]);
  const [alert, setAlert] = useState(null);
  const [avg, setAvg] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    handleTypeRoom();
  }, [roomItem]);

  const handleTypeRoom = async () => {
    try {
      const data = await getTypeRoomTop3();
      if (data) {
        setTypeRoom(data);
      } else {
        setAlert({ type: "error", title: "Lỗi không tải được dữ liệu" });
      }
    } catch (error) {
      setAlert({ type: "error", title: error.message });
    }
  }

  const getDataDetail = async (id) => {
    try {
      setAvg(id);
      const res = await getDetailTypeRoom(id.roomTypeId);
      console.log(res[0]);
      setRoomItem(res[0]); 
      setShowModal(true);
      console.log("Dữ liệu được lấy ra từ server là: ", res);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu chi tiết phòng: ", error);
      setAlert({ type: "error", title: error.message });
    }
  };
  return (
    <div className="container-xxl py-5">
      {alert && <Alert type={alert.type} title={alert.title} />}
      <div className="container">
        <CommonHeading heading="Phòng của chúng tôi" title="Phòng" subtitle="Khám phá" />
        <div className="row g-4">
          {typeRoom.map((item, key) => (
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s" key={key}>
              <div className="room-item shadow rounded overflow-hidden">
                <div className="position-relative">
                  <img className="img-fluid" src={item?.imageId[0]?.imageName} alt={item?.typeRoomName || "Room Image"} style={{ height: '272px' }} />
                  <small className="position-absolute start-0 top-100 translate-middle-y bg-orange text-white rounded py-1 px-3 ms-4">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price)}
                  </small>
                </div>
                <div className="p-4 mt-2">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="mb-0">{item?.typeRoomName}</h5>
                    <div className="ps-2">Tiêu chuẩn {item?.guestLimit} người</div>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    {[...Array(5)].map((_, i) => {
                      const fullStars = Math.floor(item.averageStars);
                      const isHalfStar = item.averageStars - fullStars >= 0.5 && i === fullStars;

                      return i < fullStars ? (
                        <FaStar key={i} className="text-warning" />
                      ) : isHalfStar ? (
                        <FaStar key={i} className="text-warning half-star" />
                      ) : (
                        <FaRegStar key={i} className="text-muted" />
                      );
                    })}
                    <small className="ms-2">
                      {item.averageStars.toFixed(1)}/5 ({item.totalReviews} đánh giá)
                    </small>
                  </div>


                  <div className="d-flex mb-3">
                    {item?.amenitiesId?.slice(0, 3).map((amenity, index) => (
                      <small
                        className="border-end me-3 pe-3 d-flex align-items-center"
                        key={index}
                        style={{ fontSize: "1.2rem" }}
                      >
                        <span style={{ fontSize: "1rem" }}> &nbsp;{amenity?.amenitiesTypeRoomDto?.amenitiesTypeRoomName}</span>
                      </small>
                    ))}
                  </div>
                  <p
                    className="text-body mb-3"
                    style={{
                      height: "80px",                  // Đặt chiều cao cố định cho phần mô tả
                      overflow: "hidden",              // Ẩn phần nội dung thừa
                      textOverflow: "ellipsis",        // Thêm dấu ba chấm khi nội dung bị cắt
                      lineHeight: "1.5",               // Điều chỉnh chiều cao dòng để tạo không gian cho chữ
                      display: "-webkit-box",          // Đặt phần tử thành box đa dòng
                      WebkitBoxOrient: "vertical",     // Đảm bảo hướng hiển thị là chiều dọc
                      WebkitLineClamp: 4,              // Giới hạn số dòng hiển thị (có thể thay đổi số dòng)
                    }}
                  >
                    {item.describes}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Button
                      className="btn btn-sm btn-primary rounded py-2 px-4"
                      onClick={() => getDataDetail(item)}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <RoomDetailModal room={roomItem} show={showModal} onClose={() => setShowModal(false)}  avgStart={avg} />
    </div>
  );
}
