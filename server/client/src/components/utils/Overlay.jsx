import React from "react";
import "./Overlay.css";
import { AlertContext } from "../../context/Alert/Alert";
const Overlay = () => {
  const {
    ToggleOverlay,
    ToggleBasket,
    ToggleBookForm,
    showBookForm,
    ToggleMenu,
    Menu,
  } = React.useContext(AlertContext);
  const onClick = (e) => {
    ToggleOverlay(false);
    ToggleBasket(false);
    if (Menu) ToggleMenu(false);
    if (showBookForm) ToggleBookForm(false);
  };
  return <div onClick={onClick} className="overlay"></div>;
};

export default Overlay;
