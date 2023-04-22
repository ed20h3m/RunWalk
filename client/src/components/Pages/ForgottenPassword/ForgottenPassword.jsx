import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/Authentication/AuthState";
import { AlertContext } from "../../../context/Alert/Alert";
import Loading from "../../utils/Loading";
import "./ForgottenPassword.css";

const ForgottenPassword = () => {
  const [state, setState] = useState("");
  const { isLoading } = useContext(AlertContext);
  const { SendResetPasswordEmail } = useContext(AuthContext);
  const onClick = () => {
    SendResetPasswordEmail(state);
  };
  const onChange = (e) => {
    setState(e.target.value);
  };
  return isLoading ? (
    <Loading />
  ) : (
    <div className="forgotten-password-con">
      <div className="forgotten-password-card">
        <div className="header">
          <h3>Change Password</h3>
        </div>
        <div className="main">
          <input
            type="Email"
            placeholder="Enter Email"
            onChange={onChange}
          ></input>
          <button onClick={onClick}>Send Email</button>
        </div>
      </div>
    </div>
  );
};

export default ForgottenPassword;
