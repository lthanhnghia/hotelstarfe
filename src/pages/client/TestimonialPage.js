import React from "react";
import Heading from "../../components/common/Heading";
import Sliders from "../../components/home/Slider";
import LayoutClient from "../../components/layout/cilent";

export default function Testimonial() {
  return (
    <LayoutClient>
      <Heading heading="LỜI CHỨNG THỰC" title="Trang chủ" subtitle="Lời chứng thực" />
      <Sliders />
    </LayoutClient>
  );
}
