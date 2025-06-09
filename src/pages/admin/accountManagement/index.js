import React from "react";
import LayoutAdmin from "../../../components/layout/admin/DefaultLayout";
import Account from "./account-client";
const AccountManager = () => {
    return (
        <LayoutAdmin>
            <div className="container-fluid">
                <Account/>
            </div>
        </LayoutAdmin>
    );
};

export default AccountManager; 