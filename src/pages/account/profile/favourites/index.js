import React from "react";

const Favourite = () => {
    return (
        <div>
            <h3>Nơi khách sạn bạn thích</h3>
            <div className="container" style={{ width: "900px" }}>
                <div className="d-flex justify-content-between flex-wrap">
                    <div className="col-md-3 p-2">
                        <div className="card">
                            <img src="./img/hotel/PhuQuoc/NovotelResort.jpg" className="card-img-top"
                                alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">Novotel Phu Quoc Resort</h5>
                                <p className="card-text"><span className="badge text-bg-orange">9.8</span>
                                    <span style={{ fontSize: "12px" }}>Tuyệt vời - 2100 đánh giá</span>
                                </p>
                                <p className="card-text" style={{ fontSize: "12px" }}><i
                                    className="bi bi-geo-alt"></i>
                                    Phú Quốc - Kiên Giang</p>
                                <p className="card-text text-end" style={{ fontSize: "12px" }}>Giá bắt đầu từ:
                                    <span style={{color: "black", fontWeight: "bolder"}}>2.100.000
                                        VNĐ</span>
                                </p>
                                <a href="#" className="btn btn-explore">Khám Phá</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Favourite;