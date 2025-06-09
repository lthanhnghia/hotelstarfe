import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { request } from "../../../../../config/configApi";
import { SearchBox } from "../RoomAndTypeRoom/Filter/FilterTypeRoom";
import { DeleteFloorModal, FloorFormModal } from "./FormModal";

const Floor = () => {
    const [selectedFloor, setSelectedFloor] = useState([]);
    const [floors, setFloors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();

    const toggleFloorSelection = (id) => {
        setSelectedFloor((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const fetchFloors = async () => {
            const response = await request({
                method: "GET",
                path: "/api/floor/getAll",
                token: Cookies.get("token"), // Thay thế bằng token nếu cần
            });

            if (response && response.length > 0) {
                setFloors(response);
            }
        };
        fetchFloors();
    }, [location]);

    const handleSearch = (value) => {
        setSearchTerm(value.toLowerCase());
    };

    // Lọc floors dựa trên searchTerm (tìm kiếm cả id và floorName)
    const filteredFloors = floors.filter((floor) =>
        floor.floorName.toLowerCase().includes(searchTerm) ||
        floor.id.toString().toLowerCase().includes(searchTerm)
    );


    return (
        <>
            <div className="d-flex justify-content-between align-items-center p-3">
                <SearchBox
                    onSearch={handleSearch}
                    placeholder="Tìm kiếm tầng..."
                />
                <FloorFormModal />
            </div>
            <div className="table-responsive mt-3">
                <table
                    className="table table-striped table-hover"
                    style={{ cursor: "pointer" }}
                >
                    <thead className="table-info">
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={() => {
                                        const allSelected =
                                            selectedFloor.length ===
                                            filteredFloors.length;
                                        setSelectedFloor(
                                            allSelected
                                                ? []
                                                : filteredFloors.map(
                                                    (floor) => floor.id
                                                )
                                        );
                                    }}
                                    checked={
                                        selectedFloor.length ===
                                        filteredFloors.length
                                    }
                                />
                            </th>
                            <th>Mã tầng</th>
                            <th>Tên tầng</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFloors.map(({ id, floorName }) => (
                            <React.Fragment key={id}>
                                <tr>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedFloor.includes(id)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleFloorSelection(id);
                                            }}
                                        />
                                    </td>
                                    <td>{id}</td>
                                    <td>{floorName}</td>
                                    <td className="text-end">
                                        <FloorFormModal
                                            id={id}
                                            floorName={floorName}
                                        />
                                        <DeleteFloorModal id={id} />
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Floor;
