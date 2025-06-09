import React, { useEffect, useState } from "react";
import { RoomServiceFormModal, DeleteRoomServiceModal } from './FormModal';
import { CAvatar } from "@coreui/react";
import { getAllRoomService } from "../../../../../../../services/admin/service-management";
import Alert from "../../../../../../../config/alert";
import { formatCurrency } from "../../../../../../../config/formatPrice";
import { useLocation } from "react-router-dom";

const RoomService = () => {
    const [roomService, setRoomService] = useState([]);
    const [alert, setAlert] = useState(null);
    const location = useLocation();

    useEffect(() => {
        handleAllRoomService();
    }, [location]);

    const handleAllRoomService = async () => {
        try {
            const data = await getAllRoomService();
            if (!data) {
                setAlert({ type: "", title: "Không có dữ liệu" });
            }else{
                setRoomService(data);
            }
        } catch (error) {
            setAlert({ type: "error", title: error.message });
        }
    }
    const refreshData = () => {
        handleAllRoomService();
    };
    return (
        <div className="table-responsive mt-3">
            {alert && <Alert type={alert.type} title={alert.title} />}
            <table className="table table-striped table-hover">
                <thead className="table-info">
                    <tr>
                        <th className="text-center">Ảnh</th>
                        <th className="text-center">Mã dịch vụ phòng</th>
                        <th className="text-center">Tên dịch vụ phòng</th>
                        <th className="text-center">Giá</th>
                        <th className="text-center">Loại dịch vụ phòng</th>
                        {/* <th className="text-center">Mô tả</th> */}
                        <th className="text-center" style={{ width: "220px" }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {roomService.map((item, index) => (
                        <tr key={index}>
                            <td className="text-center"><CAvatar src={item?.imageName}/></td>
                            <td className="text-center">{item?.id}</td>
                            <td className="text-center">{item?.serviceRoomName}</td>
                            <td className="text-center">{formatCurrency(item?.price)} VNĐ</td>
                            <td className="text-center">{item?.typeServiceRoomDto?.serviceRoomName}</td>
                            {/* <td className="text-center">{description}</td> */}
                            <td className="text-center">
                                <RoomServiceFormModal item={item}/>
                                <DeleteRoomServiceModal item={item} refreshData={refreshData}/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoomService;
