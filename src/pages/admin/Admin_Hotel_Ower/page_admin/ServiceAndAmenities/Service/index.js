import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import { Card, Col, Form, Row } from "react-bootstrap";
import HotelService from "./HotelServices";
import { HotelServiceFormModal } from './HotelServices/FormModal';
import PackedService from "./ServicePackage";
import { PackedServiceFormModal } from "./ServicePackage/FormModal";
import RoomService from "./RoomService";
import TypeServiceRoom from "./TypeServiceRoom";
import { RoomServiceFormModal } from "./RoomService/FormModal";
import { RoomServiceRoomFormModal } from "./TypeServiceRoom/FormModal";


const ServicesPageComponent = () => {
    const [currentTab, setCurrentTab] = useState(0);

    const renderTabContent = () => {
        switch (currentTab) {
            // case 0:
            //     return (<HotelService />);
            // case 1:
            //     return (<PackedService />);
            // case 2:
            //     return (<RoomService />);
            // case 3:
            //     return (<TypeServiceRoom />);
            case 0:
                return (<RoomService />);
            case 1:
                return (<TypeServiceRoom />);
            default:
                return null;
        }
    };
    const handlAddHotelServiceClick = (e) => {
        const hotelService = document.getElementById('hotel-service-form');
        if (hotelService) {
            hotelService.click();
        }
    };

    const handlAddPackedServiceClick = (e) => {
        const packedService = document.getElementById('packed-service-form');
        if (packedService) {
            packedService.click();
        }
    };

    const handlAddRoomServiceClick = (e) => {
        const roomService = document.getElementById('room-service-form');
        if (roomService) {
            roomService.click();
        }
    };

    const handlAddTypeServiceRoomClick = () => {
        const typeServiceRoom = document.getElementById('type-service-room-form');
        if (typeServiceRoom) {
            typeServiceRoom.click();
        }
    }

    return (
        <div className="container-fluid">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">Dịch vụ</h2>
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
                                    <i className="fa fa-plus-circle me-2"></i>
                                    Thêm mới
                                </button>
                                <ul className="dropdown-menu">
                                    {/* <li>
                                        <a
                                            className="dropdown-item" href="#"
                                            onClick={handlAddHotelServiceClick}
                                        >
                                            <MdAdd />
                                            Dịch vụ khách sạn
                                        </a>
                                        <div className="d-none">
                                            <HotelServiceFormModal />
                                        </div>
                                    </li>

                                    <li>
                                        <a className="dropdown-item" href="#" onClick={handlAddPackedServiceClick}>
                                            <MdAdd />
                                            Gói dịch vụ
                                            <div className="d-none">
                                                <PackedServiceFormModal/>
                                            </div>
                                        </a>
                                    </li> */}
                                    <li>
                                        <a className="dropdown-item" href="#" onClick={handlAddRoomServiceClick}>
                                            <MdAdd />
                                            Dịch vụ phòng
                                            <div className="d-none">
                                                <RoomServiceFormModal />
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#" onClick={handlAddTypeServiceRoomClick}>
                                            <MdAdd />
                                            Loại dịch vụ phòng
                                            <div className="d-none">
                                                <RoomServiceRoomFormModal />
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    {/* Tabs */}
                    <ul className="nav nav-tabs mt-4">
                        {/* <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${currentTab === 0 ? "active" : ""}`}
                                onClick={() => setCurrentTab(0)}
                            >
                                Dịch vụ khách sạn
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${currentTab === 1 ? "active" : ""}`}
                                onClick={() => setCurrentTab(1)}
                            >
                                Gói dịch vụ
                            </button>
                        </li> */}
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${currentTab === 2 ? "active" : ""}`}
                                onClick={() => setCurrentTab(0)}
                            >
                                Dịch vụ phòng
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${currentTab === 3 ? "active" : ""}`}
                                onClick={() => setCurrentTab(1)}
                            >
                                Loại dịch vụ phòng
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
export default ServicesPageComponent;