import React from "react"
import LayoutAdmin from "../../../components/layout/admin/DefaultLayout";
import AmenitiesPageComponent from "../Admin_Hotel_Ower/page_admin/ServiceAndAmenities/Amenities";
const AmenitiesPage = () => {
    return (
        <LayoutAdmin>
            <div className="container-fluid">
                <AmenitiesPageComponent />
            </div>
        </LayoutAdmin>
    );
}

export default AmenitiesPage;