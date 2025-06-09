import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { PackedServiceFormModal, DeletePackedServiceModal } from "./FormModal";
import { CAvatar } from "@coreui/react";
import { formatCurrency } from "../../../../../../../config/formatPrice";
import { getAllServicePackage } from "../../../../../../../services/admin/service-management";

const PackedService = () => {
    const [servicePackage, setServicePackage] = useState([]);

    useEffect(() => {
        handleGetAll();
    }, [])

    const handleGetAll = async () => {
        try {
            const data = await getAllServicePackage();
            if (data) {
                setServicePackage(data);
            } else {
                console.log(data);

            }

        } catch (error) {

        }
    };
    const refreshData = () => {
        handleGetAll();
    };

    return (
        <div className="table-responsive mt-3">
            <table className="table table-striped table-hover" style={{ cursor: 'pointer' }}>
                <thead className="table-info">
                    <tr>
                        {/* Bỏ checkbox chọn tất cả nếu không cần thiết */}
                        <th>Mã gói dịch vụ</th>
                        <th>Tên gói dịch vụ</th>
                        <th>Giá</th>
                        <th className="text-center" style={{ width: "220px" }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {servicePackage.map((item, index) => (
                        <tr key={index}>
                            <td>{`PKG${item?.id?.toString().padStart(3, '0') || '000'}`}</td>
                            <td>{item?.servicePackageName || "Tên không có sẵn"}</td>
                            <td>{item?.price ? `${formatCurrency(item.price)} VNĐ` : "Giá không có sẵn"}</td>
                            <td>
                                <div className="d-flex justify-content-end">
                                    {item && item.id && (
                                        <>
                                            <PackedServiceFormModal item={item} refreshData={refreshData}/>
                                            <DeletePackedServiceModal item={item} refreshData={refreshData}/>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PackedService;
