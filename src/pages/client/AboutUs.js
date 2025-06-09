import React from "react";
import Heading from "../../components/common/Heading";
import LayoutClient from "../../components/layout/cilent";
import AboutDetails from "../../components/home/AboutDetails";

export default function AboutUs() {
  return (
    <LayoutClient>
      <Heading heading="GIỚI THIỆU" title="Trang chủ" subtitle="Giới thiệu" />
      <AboutDetails />
      {/* <Team /> */}
    </LayoutClient>
  );
}
