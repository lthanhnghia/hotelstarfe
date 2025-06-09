import React from "react";
import LayoutAdmin from "../../../../components/layout/admin/DefaultLayout";
import Account from "./employee";
import { Card } from "react-bootstrap";
const Accountemployee = () => {
    return (
        <LayoutAdmin>
            <Card style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", margin: "38px",boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)' }}>
                <Account/>
            </Card>
        </LayoutAdmin>
    );
};

export default Accountemployee; 