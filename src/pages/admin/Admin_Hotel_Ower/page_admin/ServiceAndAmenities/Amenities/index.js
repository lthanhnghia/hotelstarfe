import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import { Card, Col, Row } from "react-bootstrap";
import AmenitiesTypeRoom from "./AmenitiesTypeRoom";
import { AmenitiesTypeRoomFormModal } from "./AmenitiesTypeRoom/FormModal";
import AmenitiesHotel from "./AmenitiesHotel";
import { AmenitiesHotelFormModal } from "./AmenitiesHotel/FormModal";


const AmenitiesPageComponent = () => {
    const [currentTab, setCurrentTab] = useState(0);

    const renderTabContent = () => {
        switch (currentTab) {
            case 0:
                return (<AmenitiesHotel />);
            case 1:
                return (<AmenitiesTypeRoom />);
            default:
                return null;
        }
    };
    const handlAddAmenitiesHotelClick = (e) => {
        const AmenitiesHotel = document.getElementById('amenitie-hotel-form');
        if (AmenitiesHotel) {
            AmenitiesHotel.click();
        }
    };

    const handlAddAmenitiesTypeRoomClick = (e) => {
        const AmenitiesTypeRoom = document.getElementById('amenitie-type-room-form');
        if (AmenitiesTypeRoom) {
            AmenitiesTypeRoom.click();
        }
    };

    return (
        <div className="container-fluid">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">Tiện nghi</h2>
                    <div className="row align-items-center mb-3">
                        <div className="col-12 col-md-10">
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col md={4}></Col>
                                        <Col md={4}>

                                        </Col>
                                        <Col md={4}></Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-12 col-md-2 text-md-end">
                            <div className="btn-group">
                                <button type="button" className="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <MdAdd />&nbsp;
                                    Thêm mới
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a
                                            className="dropdown-item" href="#"
                                            onClick={handlAddAmenitiesHotelClick}
                                        >
                                            <MdAdd />
                                            Tiện nghi khách sạn
                                        </a>
                                        <div className="d-none">
                                           <AmenitiesHotelFormModal />
                                        </div>
                                    </li>

                                    <li>
                                        <a className="dropdown-item" href="#" onClick={handlAddAmenitiesTypeRoomClick}>
                                            <MdAdd />
                                            Tiện nghi loại phòng
                                            <div className="d-none">
                                               <AmenitiesTypeRoomFormModal />
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    {/* Tabs */}
                    <ul className="nav nav-tabs mt-4">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${currentTab === 0 ? "active" : ""}`}
                                onClick={() => setCurrentTab(0)}
                            >
                                Tiện nghi khách sạn
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${currentTab === 1 ? "active" : ""}`}
                                onClick={() => setCurrentTab(1)}
                            >
                                Tiện nghi loại phòng
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AmenitiesPageComponent;