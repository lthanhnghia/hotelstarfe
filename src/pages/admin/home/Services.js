import React from "react"
import LayoutAdmin from "../../../components/layout/admin/DefaultLayout";
import ServicesPageComponent from '../Admin_Hotel_Ower/page_admin/ServiceAndAmenities/Service';
const ServicesPage = () => {
    return (
        <LayoutAdmin>
            <div className="container-fluid">
                <ServicesPageComponent />
            </div>
        </LayoutAdmin>
    );
}

export default ServicesPage;