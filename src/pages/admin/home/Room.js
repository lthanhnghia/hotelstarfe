import React from "react"
import LayoutAdmin from "../../../components/layout/admin/DefaultLayout";
import RoomAndTypeRoom from "../Admin_Hotel_Ower/page_admin/RoomAndTypeRoom/RoomAndTypeRoom";
const RoomAdmin = () => {
    return (
        <LayoutAdmin>
            <div className="container-fluid">
                <RoomAndTypeRoom />
            </div>
        </LayoutAdmin>
    );
}

export default RoomAdmin;