import React from "react";
import Logo from "../assests/images/logo.svg";
import discordIcon from "../assests/images/discordIcon.svg";
import telegramIcon from "../assests/images/telegramIcon.svg";
import twitterIcon from "../assests/images/twitterIcon.svg";
import "./style.css";

export default function Footer() {
  return (
    <footer>
      <div className="container mobile-width">
        <div className="footer-wrapper" id="foot-wrapper">
          <div className="logo cursor-pointer">
            <img className="footer-logo" src={Logo} alt="" />
            <p className="footer-text">CroKing</p>
          </div>
          <div className="social-icons-div">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://t.me/CroKingOfficial"
            >
              <img
                src={telegramIcon}
                className="social-icons"
                alt="telegram-icon"
              />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/crokingtoken"
            >
              {" "}
              <img
                src={twitterIcon}
                className="social-icons"
                alt="twitter-icon"
              />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://discord.gg/BPVuZQH3Cz"
            >
              <img
                src={discordIcon}
                className="social-icons"
                alt="discord-icon"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
