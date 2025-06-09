import React from "react"
import LayoutAdmin from "../../../components/layout/admin/DefaultLayout";
import Floor from "../Admin_Hotel_Ower/page_admin/Floor";
const FloorPage = () => {
    return (
        <LayoutAdmin>
            <div className="container-fluid">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">Tầng</h2>
                        <Floor />
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    );
}

export default FloorPage;