import React from "react";
import RoomPowerComponent from "../Admin_Hotel_Ower/page_admin/chartPie";
import RoomTable from "../Admin_Hotel_Ower/page_admin/RoomTable/RoomTable";
import LayoutAdmin from "../../../components/layout/admin/DefaultLayout";
const HomeAdmin = () => {
    return (
        <LayoutAdmin>
            <div className="container-fluid">
                <RoomPowerComponent />
                <RoomTable/>
            </div>
        </LayoutAdmin>
    );
};

export default HomeAdmin; 