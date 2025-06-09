import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { SearchBooking } from "../ModalBooking/ModelBooking";

const Booking_Container = () => {
    return (
        <>
            <Card style={{ border: 'none', background: '#fff', boxShadow: 'none' }}>
                <Card.Body>
                    <Row>
                        <SearchBooking />
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
}

export { Booking_Container };