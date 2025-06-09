import React, { useState, useEffect, useCallback } from "react";
import { AmenitiesHotelFormModal, DeleteAmenitiesHotelModal } from "./FormModal";
import { request } from "../../../../../../../config/configApi";
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';

const AmenitiesHotel = () => {
    const [selectedAmenitiesHotel, setSelectedAmenitiesHotel] = useState([]);
    const [amenitiesHotels, setAmenitiesHotels] = useState([]);
    const location = useLocation();

    const toggleAmenitiesHotelSelection = (id) => {
        setSelectedAmenitiesHotel(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const fetchAmenitiesHotels = async () => {
            const response = await request({
                method: "GET",
                path: "/api/amenitiesHotel/getAll",
                token: Cookies.get('token'), // Thay thế bằng token nếu cần
            });

            if (response && response.length > 0) {
                setAmenitiesHotels(response);
            };
        };
        fetchAmenitiesHotels();
    }, [location]);

    return (
        <div className="table-responsive mt-3">
            <table className="table table-striped table-hover" style={{ cursor: 'pointer' }}>
                <thead className="table-info">
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={() => {
                                    const allSelected = selectedAmenitiesHotel.length === amenitiesHotels.length;
                                    setSelectedAmenitiesHotel(allSelected ? [] : amenitiesHotels.map(amenitiesHotel => amenitiesHotel.id));
                                }}
                                checked={selectedAmenitiesHotel.length === amenitiesHotels.length}
                            />
                        </th>
                        <th>Mã tiện nghi khách sạn</th>
                        <th>Tên tiện nghi khách sạn</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {amenitiesHotels.map(({ id, amenitiesHotelName }) => (
                        <React.Fragment key={id}>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedAmenitiesHotel.includes(id)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            toggleAmenitiesHotelSelection(id);
                                        }}
                                    />
                                </td>
                                <td>{id}</td>
                                <td>{amenitiesHotelName}</td>
                                <td className="text-end">
                                    <AmenitiesHotelFormModal idAmenitiesHotel={id} />
                                    <DeleteAmenitiesHotelModal id={id} />
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AmenitiesHotel;
