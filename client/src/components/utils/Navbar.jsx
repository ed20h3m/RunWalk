/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from "react";
import { AlertContext } from "../../context/Alert/Alert";
import "./Nav.css";

const Navbar = () => {
  const {
    showOverlay,
    ToggleOverlay,
    ToggleBasket,
    showBasket,
    Menu,
    ToggleMenu,
  } = useContext(AlertContext);
  const isLoggedIn =
    localStorage.CustomerToken ||
    localStorage.EmployeeToken ||
    localStorage.ManagerToken;
  return (
    <nav>
      <div className="nav-logo-container">
        <img
          src="https://th.bing.com/th/id/OIP.sDGRfLCFGcM8RIBnTjptjgHaHa?pid=ImgDet&rs=1"
          style={{ width: "4rem", height: "4rem", borderRadius: "100%" }}
        />
      </div>
      <div className="navbar-links-container">
        {!isLoggedIn && <a href="/">Home</a>}
        {localStorage.CustomerToken && <a href="/profile">Profile</a>}
        {!isLoggedIn && <a href="/login">Login</a>}
        {!isLoggedIn && <a href="/signup">Sign up</a>}
        {localStorage.EmployeeToken && <a href="/employee/home">Sessions</a>}
        {localStorage.CustomerToken && <a href="/customer/home">Sessions</a>}
        {(localStorage.CustomerToken || localStorage.EmployeeToken) && (
          <a
            href=""
            onClick={(e) => {
              ToggleOverlay(true);
              ToggleBasket(!showBasket);
              e.preventDefault();
            }}
          >
            Basket
          </a>
        )}
        {localStorage.CustomerToken && (
          <a href="/customer/activity">Activities</a>
        )}
        {isLoggedIn && (
          <a href="/" onClick={() => localStorage.clear()}>
            Log out
          </a>
        )}
      </div>
      <div
        className="burger"
        onClick={(e) => {
          ToggleOverlay(!showOverlay);
          ToggleMenu(!Menu);
          e.preventDefault();
        }}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="side-menuuu">
        {!isLoggedIn && <a href="/">Home</a>}
        {localStorage.CustomerToken && <a href="/profile">Profile</a>}
        {!isLoggedIn && <a href="/login">Login</a>}
        {!isLoggedIn && <a href="/signup">Sign up</a>}
        {localStorage.EmployeeToken && <a href="/employee/home">Sessions</a>}
        {localStorage.CustomerToken && <a href="/customer/home">Sessions</a>}
        {(localStorage.CustomerToken || localStorage.EmployeeToken) && (
          <a
            href=""
            onClick={(e) => {
              ToggleOverlay(true);
              ToggleBasket(!showBasket);
              e.preventDefault();
            }}
          >
            Basket
          </a>
        )}
        {localStorage.CustomerToken && (
          <a href="/customer/activity">Activities</a>
        )}
        {isLoggedIn && (
          <a href="/" onClick={() => localStorage.clear()}>
            Log out
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
