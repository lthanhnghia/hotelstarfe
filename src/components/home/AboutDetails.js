import React, { useEffect, useState } from "react";
import './button.css'
import { getListStaff } from "./Service/Index";
export default function AboutDetails() {
    const [dataStaff, setDataStaff] = useState([]);

    const employees = dataStaff.map((staff) => ({
        id: staff?.id,
        name: staff?.fullname,
        role: staff?.roleName,
        image: staff?.avatar || 'https://png.pngtree.com/png-clipart/20210308/original/pngtree-personnel-icon-vector-material-png-image_5751805.jpg',
    }));

    const getDataListStaff = async () => {
        try {
            const res = await getListStaff();
            setDataStaff(res);
            console.log("Dữ liệu từ service: ", res);
        } catch (error) {
            console.log("Không lấy được danh sách: ", error);
        }
    }

    useEffect(() => {
        getDataListStaff()
    }, []);

    const chunkedEmployees = [];
    for (let i = 0; i < employees.length; i += 4) {
        chunkedEmployees.push(employees.slice(i, i + 4));
    }
    return (
        <div className="container mt-5">
            <div className="row">
                {/* Cột Nội dung */}
                <div className="col-md-7">
                    <div className="content">
                        {/* Tiêu đề */}
                        <h1
                            className="title text-center"
                            style={{
                                color: "#ffc107",
                                fontWeight: "bold",
                                fontSize: "2.5rem",
                                marginBottom: "1rem",
                            }}
                        >
                            Khách sạn Stars, Cần Thơ
                        </h1>
                        <hr
                            style={{
                                width: "50%",
                                height: "3px",
                                backgroundColor: "#ffc107",
                                border: "none",
                                margin: "0 auto 1.5rem",
                            }}
                        />

                        {/* Mở bài */}
                        <p
                            style={{
                                fontSize: "1.2rem",
                                lineHeight: "1.8",
                                color: "#555",
                                marginBottom: "1.5rem",
                                textAlign: "justify",
                            }}
                        >
                            Nằm tại trung tâm thành phố Cần Thơ, khách sạn Stars mang đến không gian
                            nghỉ dưỡng thanh lịch, tiện nghi và dịch vụ đẳng cấp. Đây là nơi lý tưởng
                            cho những chuyến du lịch và công tác.
                        </p>

                        {/* Thân bài */}
                        <p
                            style={{
                                fontSize: "1.2rem",
                                lineHeight: "1.8",
                                color: "#555",
                                marginBottom: "1.5rem",
                                textAlign: "justify",
                            }}
                        >
                            Tận hưởng hệ thống phòng hiện đại với view sông Hậu thơ mộng, thưởng thức
                            ẩm thực đặc sắc, và thư giãn tại spa hoặc hồ bơi. Stars còn cung cấp các
                            dịch vụ hội nghị, đưa đón sân bay và nhiều tiện ích khác, đáp ứng mọi nhu cầu
                            của bạn.
                        </p>

                        {/* Kết bài */}
                        <p
                            style={{
                                fontSize: "1.2rem",
                                lineHeight: "1.8",
                                color: "#555",
                                textAlign: "justify",
                            }}
                        >
                            Khách sạn Stars là lựa chọn hoàn hảo cho hành trình khám phá miền Tây Nam Bộ.
                            Rất hân hạnh được phục vụ quý khách!
                        </p>
                    </div>
                </div>

                {/* Cột Hình ảnh */}
                <div className="col-md-5">
                    <div className="image-section text-center">
                        <img
                            src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/04/ee/f6/hotel-exterior.jpg?w=1200&h=-1&s=1"
                            alt="Khách sạn Stars Cần Thơ"
                            className="img-fluid rounded"
                            style={{
                                border: "5px solid #ffc107",
                                marginBottom: "1.5rem",
                                boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                            }}
                        />
                        <h3
                            className="hotel-name"
                            style={{
                                color: "#ffc107",
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Khách sạn Stars
                        </h3>
                        <p
                            className="location"
                            style={{ fontStyle: "italic", color: "#666", fontSize: "1rem" }}
                        >
                            Thành phố Cần Thơ, Việt Nam
                        </p>
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-md-12">
                    <h3
                        className="text-center"
                        style={{
                            color: "#ffc107",
                            fontWeight: "bold",
                            fontSize: "2rem",
                            marginBottom: "1rem",
                        }}
                    >
                        Tại sao nên chọn khách sạn Stars?
                    </h3>
                    <hr
                        style={{
                            width: "20%",
                            height: "3px",
                            backgroundColor: "#ffc107",
                            border: "none",
                            margin: "0 auto 1.5rem",
                        }}
                    />
                    <ul style={{ listStyle: "none", paddingLeft: 0, fontSize: "1.2rem", color: "#555" }}>
                        <li>
                            <i className="bi bi-check-circle-fill" style={{ color: "#ffc107", marginRight: "10px" }}></i>
                            Vị trí trung tâm, gần các điểm du lịch nổi tiếng như Chợ nổi Cái Răng và Bến Ninh Kiều.
                        </li>
                        <li>
                            <i className="bi bi-check-circle-fill" style={{ color: "#ffc107", marginRight: "10px" }}></i>
                            Phòng nghỉ hiện đại với view sông Hậu tuyệt đẹp.
                        </li>
                        <li>
                            <i className="bi bi-check-circle-fill" style={{ color: "#ffc107", marginRight: "10px" }}></i>
                            Dịch vụ đa dạng: hội nghị, spa, đưa đón sân bay.
                        </li>
                        <li>
                            <i className="bi bi-check-circle-fill" style={{ color: "#ffc107", marginRight: "10px" }}></i>
                            Đội ngũ nhân viên tận tình, chuyên nghiệp.
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container mt-5">
                {/* Phần tiêu đề nội dung */}
                <div className="text-center mb-4">
                    <h3
                        style={{
                            color: "#ffc107",
                            fontWeight: "bold",
                            fontSize: "2rem",
                            marginBottom: "0.5rem",
                        }}
                    >
                        Danh sách nhân viên khách sạn
                    </h3>
                    <p style={{ fontStyle: "italic", color: "#555" }}>
                        Hãy khám phá những nhân viên tận tâm và nhiệt tình của chúng tôi!
                    </p>
                    <hr
                        style={{
                            width: "10%",
                            height: "3px",
                            backgroundColor: "#ffc107",
                            border: "none",
                            margin: "0 auto",
                        }}
                    />
                </div>

                {/* Carousel */}
                <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {chunkedEmployees.map((group, index) => (
                            <div
                                key={index}
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                            >
                                <div className="row justify-content-center">
                                    {group.map((employee) => (
                                        <div
                                            key={employee.id}
                                            className="col-md-3 text-center"
                                        >
                                            <img
                                                src={employee.image}
                                                alt={employee.name}
                                                style={{
                                                    width: "100%",
                                                    height: "200px", // Chiều cao cố định
                                                    objectFit: "cover", // Tránh méo ảnh
                                                    borderRadius: "10px",
                                                    boxShadow:
                                                        "0px 4px 8px rgba(0,0,0,0.1)",
                                                    marginBottom: "1.5rem",
                                                }}
                                            />
                                            <h5 style={{ color: "#555" }}>
                                                {employee.name}
                                            </h5>
                                            <p
                                                style={{
                                                    fontStyle: "italic",
                                                    color: "#777",
                                                }}
                                            >
                                                {employee.role === 'Staff' ? "Nhân viên" : "Nhân viên"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Nút Previous */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide="prev"
                    >
                        <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                            style={{ backgroundColor: "black", borderRadius: "50%" }}
                        ></span>
                        <span className="visually-hidden">Previous</span>
                    </button>

                    {/* Nút Next */}
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide="next"
                    >
                        <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                            style={{ backgroundColor: "black", borderRadius: "50%" }}
                        ></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-md-12">
                    <h3
                        className="text-center"
                        style={{
                            color: "#ffc107",
                            fontWeight: "bold",
                            fontSize: "2rem",
                            marginBottom: "1rem",
                        }}
                    >
                        Vị trí của chúng tôi
                    </h3>
                    <hr
                        style={{
                            width: "20%",
                            height: "3px",
                            backgroundColor: "#ffc107",
                            border: "none",
                            margin: "0 auto 1.5rem",
                        }}
                    />
                    <div className="text-center">
                        <div className="text-center">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.6202245720406!2d105.78292517450903!3d10.048163972205188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08964e0966179%3A0x2b7605c32ddaefea!2sFIT%20Hotel%20Can%20Tho!5e0!3m2!1svi!2s!4v1732890323766!5m2!1svi!2s"
                                style={{
                                    border: "none",
                                    width: "100%",
                                    height: "500px",
                                    borderRadius: "10px",
                                }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}
