import React, { useEffect, useState, useMemo } from 'react';
import RoomSchedule from '../RoomSchedule';
import { Card } from 'react-bootstrap';
import { getAllFloor } from '../../../../services/employee/floor';
import FillterDateHome from '../FillterDate';

const getDatesForNextWeek = (startDate) => {
  const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i); // Tính toán ngày
    const dayName = daysOfWeek[date.getDay()]; // Lấy tên ngày trong tuần
    const formattedDate = `${date.getDate()} - ${dayName}`; // Định dạng ngày
    dates.push(formattedDate);
  }

  return dates;
};

function ScheduleBoard() {
  const [expandedFloors, setExpandedFloors] = useState({});
  const [floors, setFloors] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const dates = useMemo(() => getDatesForNextWeek(startDate || new Date()), [startDate]);

  useEffect(() => {
    handleGetAllFloor();
  }, []);

  const handleGetAllFloor = async () => {
    const data = await getAllFloor();
    setFloors(data);
  };

  const handleDateFilterChange = (start, end) => {
    setStartDate(start || new Date());
    const adjustedEnd = end || new Date();
    adjustedEnd.setDate(adjustedEnd.getDate() + 7);
    setEndDate(adjustedEnd);
  };


  const toggleFloor = (floor) => {
    setExpandedFloors((prevState) => ({
      ...prevState,
      [floor]: !prevState[floor],
    }));
  };

  return (
    <>
      <FillterDateHome onDatesChange={handleDateFilterChange} />
      <div className="schedule-board">
        <div className="header">
          <div className="dates">
            {dates.map((date, index) => (
              <div className="date" key={index}>{date}</div>
            ))}
          </div>
        </div>
        {floors.map((floorData, index) => (
          <div key={index} className="floor-section">
            <div className="floor-header" onClick={() => toggleFloor(floorData.id)}>
              <span className="toggle-icon">{expandedFloors[floorData.id] ? '-' : '+'}</span>
              {floorData.floorName}
            </div>
            {expandedFloors[floorData.id] && floorData.roomDtos.length > 0 && (
              <div className="rooms">
                {floorData.roomDtos.map((room) => (
                  <RoomSchedule
                    key={room.id}
                    room={room}
                    startDate={startDate}
                    endDate={endDate}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default ScheduleBoard;
