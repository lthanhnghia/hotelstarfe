import React, { useState, useEffect } from 'react';
import {
  AmenitiesTypeRoomFormModal,
  DeleteAmenitiesTypeRoomModal,
} from './FormModal';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import { request } from '../../../../../../../config/configApi';

const AmenitiesTypeRoom = () => {
  const [selectedAmenitiesTypeRoom, setSelectedAmenitiesTypeRoom] = useState([])
  const [amenitiesTypeRooms, setAmenitiesTypeRooms] = useState([])
  const location = useLocation();

  const toggleAmenitiesTypeRoomSelection = (id) => {
    setSelectedAmenitiesTypeRoom((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  };

  useEffect(() => {
    const fetchAmenitiesTypeRooms = async () => {
      const response = await request({
        method: "GET",
        path: "/api/amenities-type-room/getAll",
        token: Cookies.get('token'), // Thay thế bằng token nếu cần
      });

      if (response && response.length > 0) {
        setAmenitiesTypeRooms(response);
      };
    };
    fetchAmenitiesTypeRooms();
  }, [location]);

  return (
    <div className="table-responsive mt-3">
      <table
        className="table table-striped table-hover"
        style={{ cursor: 'pointer' }}
      >
        <thead className="table-info">
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={() => {
                  const allSelected =
                    selectedAmenitiesTypeRoom.length ===
                    amenitiesTypeRooms.length;
                  setSelectedAmenitiesTypeRoom(
                    allSelected
                      ? []
                      : amenitiesTypeRooms.map(
                        (amenitiesTypeRoom) => amenitiesTypeRoom.id,
                      ),
                  );
                }}
                checked={
                  selectedAmenitiesTypeRoom.length ===
                  amenitiesTypeRooms.length
                }
              />
            </th>
            <th>Mã tiện nghi loại phòng</th>
            <th>Tên tiện nghi loại phòng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {amenitiesTypeRooms.map(({ id, amenitiesTypeRoomName }) => (
            <React.Fragment key={id}>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedAmenitiesTypeRoom.includes(id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      toggleAmenitiesTypeRoomSelection(id);
                    }}
                  />
                </td>
                <td>{id}</td>
                <td>{amenitiesTypeRoomName}</td>
                <td className='text-end'>
                  <AmenitiesTypeRoomFormModal idAmenitiesTypeRoom={id} amenitiesTypeRoomName={amenitiesTypeRoomName} />
                  <DeleteAmenitiesTypeRoomModal id={id} />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AmenitiesTypeRoom
