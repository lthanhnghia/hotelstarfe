import React from "react";
import DiscountManager from "../Admin_Hotel_Ower/page_admin/RoomPrice/ContainerConponent";
import LayoutAdmin from "../../../components/layout/admin/DefaultLayout";
const RoomPriceManager = () => {
    return (
        <LayoutAdmin>
            <div className="container-fluid">
                <DiscountManager />
            </div>
        </LayoutAdmin>
    );
}

export default RoomPriceManager;