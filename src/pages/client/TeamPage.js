import React from "react";
import Heading from "../../components/common/Heading";
import Teams from "../../components/home/Team";
import LayoutClient from "../../components/layout/cilent";

export default function Team() {
  return (
    <LayoutClient>
      <Heading heading="Team" title="Home" subtitle="Team" />
      <Teams />
    </LayoutClient>
  );
}
