import React, { useEffect, useState } from "react";
import Carousel from "./Carousel";
import Book from "./Book";
import Services from "./Service";
import Rooms from "./Rooms";
import Sliders from "./Slider";
// import Teams from "./Team";
import LayoutClient from "../layout/cilent";
import About from "./About";
import DiscountBanner from "../../pages/client/discount-banner";
import Cookies from 'js-cookie';
import { jwtDecode as jwt_decode } from "jwt-decode";
import ChatApp from "./ChatGemini";
export default function Home() {
  const token = Cookies.get('token');
  const decodedTokens = token ? jwt_decode(token) : null;
  return (
    <LayoutClient>
      <Carousel />
      <Book />
      <About />
      <Rooms />
      <Services />
      <ChatApp/>
      {/* <Sliders /> */}
      {decodedTokens && (
        <DiscountBanner id_account={decodedTokens.id} />
      )}
    </LayoutClient>
  );
}