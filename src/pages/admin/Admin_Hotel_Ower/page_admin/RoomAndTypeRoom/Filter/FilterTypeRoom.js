import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, InputGroup } from 'react-bootstrap';
import '../Filter/style/customCss.css';
import { Add_Floor } from '../Rom/AddAndUpdate';
import Select from 'react-select';
import { RiAddCircleLine } from "react-icons/ri";
import { request } from '../../../../../../config/configApi';
import Cookies from 'js-cookie';
import { BsSearch } from 'react-icons/bs';

// Component tìm kiếm chung
function SearchBox({ placeholder, onSearch }) {
    return (
        <Form.Group controlId="search">
            <InputGroup>
                <InputGroup.Text>
                    <BsSearch style={{ fontSize: "24px" }} />
                </InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder={placeholder}
                    onChange={(e) => onSearch(e.target.value)}
                />
            </InputGroup>
        </Form.Group>
    );
};

function SearchDateBox({ onChange }) {
    return (
        <Form.Group controlId="search">
            <Form.Control
                type="date"
                onChange={(e) => onChange(e.target.value)}
            />
        </Form.Group>
    );
};

// Component chọn trạng thái với combobox
function StatusSelector({ onStatusChange }) {
    const [status, setStatus] = useState('');
    const [statusRooms, setStatusRooms] = useState([]); // Lưu trữ trạng thái phòng từ API


    // Gọi fetchStatusRooms khi component mount
    useEffect(() => {
        const fetchStatusRooms = async () => {
            try {
                const response = await request({
                    method: "GET",
                    path: "/api/status-room/getAll",
                    token: Cookies.get('token'), // Thay thế bằng token nếu cần
                });

                if (response && response.length > 0) {
                    setStatusRooms(response);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách trạng thái phòng:", error);
            }
        };
        fetchStatusRooms();
    }, []);

    // Xử lý thay đổi trạng thái
    const handleStatusChange = (e) => {
        const selectedStatus = e.target.value;
        setStatus(selectedStatus);
        if (onStatusChange) {
            onStatusChange(selectedStatus); // Gọi callback từ props nếu có
        }
    };

    return (
        <Form>
            <Form.Select
                value={status}
                onChange={handleStatusChange}
            >
                <option value="">Tất cả</option>
                {statusRooms.map((roomStatus) => (
                    <option key={roomStatus.id} value={roomStatus.id}>
                        {roomStatus.statusRoomName}
                    </option>
                ))}
            </Form.Select>
        </Form>
    );
}


// Component chọn loại phòng với combobox có tìm kiếm
function RoomTypeSelector({ onChange }) {
    const [selectedRoomType, setSelectedRoomType] = useState();
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const response = await request({
                    method: "GET",
                    path: "/api/type-room/getAll",
                    token: Cookies.get("token"), // Thay thế bằng token nếu cần
                });

                if (response && response.length > 0) {
                    const options = response.map(roomType => ({
                        value: roomType.id,
                        label: roomType.typeRoomName,
                    }));
                    setOptions(options);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách loại phòng:", error);
            }
        };

        fetchRoomTypes();
    }, []);

    const handleChange = (selectedOption) => {
        setSelectedRoomType(selectedOption);
        if (onChange) {
            onChange(selectedOption); // Gọi callback khi có giá trị được chọn
        }
    };

    return (
        <Form>
            <Form.Group controlId="searchRoomType">
                <Select
                    options={options}
                    placeholder="Tìm kiếm loại phòng..."
                    value={selectedRoomType}
                    onChange={handleChange}
                    isClearable
                    isSearchable
                />
            </Form.Group>
        </Form>
    );
};


// Component chọn khu vực với combobox có tìm kiếm và nút thêm
function FloorSelector({ onFloorChange }) {
    const [options, setOptions] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState(null);

    useEffect(() => {
        const fetchFloors = async () => {
            try {
                const response = await request({
                    method: "GET",
                    path: "/api/floor/getAll",
                    token: Cookies.get("token"), // Thay thế bằng token nếu cần
                });

                if (response && response.length > 0) {
                    const options = response.map(floor => ({
                        value: floor.id,
                        label: floor.floorName,
                    }));
                    setOptions(options);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tầng:", error);
            }
        };

        fetchFloors();
    }, []);

    const handleFloorChange = (selectedOption) => {
        setSelectedFloor(selectedOption || null);
        if (onFloorChange) {
            onFloorChange(selectedOption); // Gọi callback khi giá trị được thay đổi
        }
    };

    return (
        <Form>
            <Form.Group controlId="searchFloor">
                <Select
                    options={options}
                    placeholder="Tìm kiếm tầng..."
                    value={selectedFloor}
                    onChange={handleFloorChange}
                    isClearable
                    isSearchable
                />
            </Form.Group>
        </Form>
    );
}


// Xuất các component chính
export { SearchBox, StatusSelector, RoomTypeSelector, FloorSelector, SearchDateBox };
