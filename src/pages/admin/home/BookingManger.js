import React from "react"
import { Booking_Container } from "../Admin_Hotel_Ower/page_admin/BookingRoom/Booking/BookingContainer";
import LayoutAdmin from "../../../components/layout/admin/DefaultLayout";
const BookingManger = () => {
    return (
        <LayoutAdmin>
            <div className="container-fluid">
                <Booking_Container />
            </div>
        </LayoutAdmin>
    );
}

export default BookingManger;