import React from "react";
import Heading from "../../../components/common/Heading";
import LayoutClient from "../../../components/layout/cilent"
import ListRoom from "../../../components/home/ListRoom";

export default function RoomClient() {
  return (
    <LayoutClient>
      <Heading heading="PHÒNG" title="Trang chủ" subtitle="Phòng" />
      <ListRoom />
    </LayoutClient>
  );
}
