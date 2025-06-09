import React from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";

export default function LayoutClient({ children }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}