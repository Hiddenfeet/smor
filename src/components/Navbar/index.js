import React from "react";
import Logo from "../assests/images/logo.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import "./style.css";

export default function Navbar(props) {
  return (
    <>
      <header className="primary-header">
        <div className="container mobile-width">
          <div className="nav-wrapper" id="nav-wrapper">
            <div className="logo cursor-pointer">
              <img src={Logo} alt="" />
              <p>CroKing</p>
            </div>
            <ConnectButton sx={{ color: "#020202" }} />
          </div>
        </div>
      </header>
    </>
  );
}
