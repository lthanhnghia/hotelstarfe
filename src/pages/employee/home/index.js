import React from "react";
import Layoutemployee from "../../../components/layout/employee";
import ScheduleBoard from "./ScheduleBoard";
import FillterDateHome from "./FillterDate";
import { cilStream } from "@coreui/icons";

const Homeemployee = () => {
    return(
        <Layoutemployee title={"Sơ đồ lưới"} icons={cilStream}>
            {/* <FillterDateHome/> */}
            <ScheduleBoard/>
        </Layoutemployee>
    )
}

export default Homeemployee;