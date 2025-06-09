import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { DeleteHotelServiceModal, HotelServiceFormModal } from './FormModal';
import { request } from "../../../../../../../config/configApi";
import { formatCurrency } from "../../../../../../../config/formatPrice";
import { CAvatar } from "@coreui/react";

const HotelService = () => {
    const [selectedHotelService, setSelectedHotelService] = useState([]);
    const [dataServiceHotel, setDataService] = useState([]);

    useEffect(() => {
        handleGetData();
    }, []);

    const toggleHotelServiceSelection = (id) => {
        setSelectedHotelService(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleGetData = async () => {
        const response = await request({ method: "GET", path: "api/service-hotel/getAll" });
        setDataService(response);
    }
    const refreshData = () => {
        handleGetData();
    };
    return (
        <div className="table-responsive mt-3">
            <table className="table table-striped table-hover" style={{ cursor: 'pointer' }}>
                <thead className="table-info">
                    <tr>
                        {/* <th>
                            <input
                                type="checkbox"
                                onChange={() => {
                                    const allSelected = selectedHotelService.length === dataServiceHotel.length;
                                    setSelectedHotelService(allSelected ? [] : dataServiceHotel.map(hotelService => hotelService.id));
                                }}
                                checked={selectedHotelService.length === dataServiceHotel.length}
                            />
                        </th> */}
                        <th>Ảnh</th>
                        <th>Mã dịch vụ khách sạn</th>
                        <th>Tên dịch vụ khách sạn</th>
                        <th>Giá</th>
                        <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {dataServiceHotel.map((item) => (
                        <tr key={item?.id}>
                            {/* <td>
                                <input
                                    type="checkbox"
                                    checked={selectedHotelService.includes(item?.id)}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        toggleHotelServiceSelection(item?.id);
                                    }}
                                />
                            </td> */}
                            <td><CAvatar src={item?.image} /></td>
                            <td>{`SV${item?.id.toString().padStart(3, '0')}`}</td>
                            <td>{item?.serviceHotelName}</td>
                            <td>{formatCurrency(item?.price)} VNĐ</td>
                            <td>
                                <div className="d-flex justify-content-end">
                                    <HotelServiceFormModal item={item} refreshData={refreshData} />
                                    <DeleteHotelServiceModal item={item} onDeleteSuccess={handleGetData} refreshData={refreshData} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HotelService;
