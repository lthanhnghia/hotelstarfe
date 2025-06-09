import React, { useEffect, useState } from "react";
import { DeleteTypeServiceModal, RoomServiceRoomFormModal } from "./FormModal";
import { getAllTypeRoomService } from "../../../../../../../services/admin/service-management";
import Alert from "../../../../../../../config/alert";
import { useLocation } from "react-router-dom";

const TypeServiceRoom = () => {
    const [typeServiceRooms, setTypeServiceRooms] = useState([]);
    const [alert, setAlert] = useState(null);
    const location = useLocation();
    useEffect(() => {
        handleTypeServiceRoom();
    }, [location])

    const handleTypeServiceRoom = async () => {
        try {
            const data = await getAllTypeRoomService();
            if (data) {
                setTypeServiceRooms(data);
            } else {
                setAlert({ type: "error", title: "Không có dữ liệu" });
            }
        } catch (error) {
            setAlert({ type: "error", title: error.message });
        }
    }
    const refreshData = () => {
        handleTypeServiceRoom();
    };
    return (
        <div className="table-responsive mt-3">
            {alert && <Alert type={alert.type} title={alert.title} />}
            <table className="table table-striped table-hover">
                <thead className="table-info">
                    <tr>
                        <th>Mã loại dịch vụ phòng</th>
                        <th className="text-center">Tên gói dịch vụ</th>
                        <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {typeServiceRooms.map((item, index) => (
                        <tr key={index}>
                            <td>{item?.id}</td>
                            <td className="text-center">{item?.serviceRoomName}</td>
                            <td className="text-center">
                                <RoomServiceRoomFormModal item={item}/>
                                <DeleteTypeServiceModal item={item} refreshData={refreshData} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TypeServiceRoom;
