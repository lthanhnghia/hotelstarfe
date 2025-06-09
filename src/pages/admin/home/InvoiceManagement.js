import React from "react";
import { InvoiceContainer } from "../Admin_Hotel_Ower/page_admin/InvoiceManagement/filter";
import LayoutAdmin from "../../../components/layout/admin/DefaultLayout";
const InvoiceManagement = () => {
    return (
        <LayoutAdmin>
            <div className="container-fluid">
                <InvoiceContainer />
            </div>
        </LayoutAdmin>
    );
};

export default InvoiceManagement; 