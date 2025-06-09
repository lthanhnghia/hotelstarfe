import React from "react"
import LayoutAdmin from "../../../components/layout/admin/DefaultLayout";
import FeedbackPageComponent from "../Admin_Hotel_Ower/page_admin/feedback";
const FeedbackPage = () => {
    return (
        <LayoutAdmin>
            <div className="container-fluid">
                <FeedbackPageComponent />
            </div>
        </LayoutAdmin>
    );
}

export default FeedbackPage;