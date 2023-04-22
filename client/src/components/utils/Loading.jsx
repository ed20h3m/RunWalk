import React from "react";
import logo from "./logo.gif";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading">
      <img src={logo} alt="" />
    </div>
  );
};

export default Loading;
