import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../../context/Authentication/AuthState";
import { AlertContext } from "../../../context/Alert/Alert";
import { Routes, Route, useParams } from "react-router-dom";
import Loading from "../../utils/Loading";
import "./ChangePassword.css";

const ChangePassword = () => {
  const { id, token } = useParams();
  const [state, setState] = useState({
    password: "",
    password2: "",
    res: null,
  });
  const { validateLink, changePass } = useContext(AuthContext);
  const { SetAlert, isLoading } = useContext(AlertContext);
  useEffect(() => {
    async function fetchData() {
      if (localStorage.token) localStorage.clear();
      const res = await validateLink(id, token);
      if (res !== true) window.location.href = "/";
      setState({ ...state, res: res });
    }
    fetchData();
  }, []);

  const onClick = async () => {
    if (state.password === "" || state.password2 === "")
      return SetAlert("Empty Password", "error");
    await changePass(id, token, state.password, state.password2);
  };
  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="change-password-con">
      <div className="change-password-card">
        <div className="header">
          <h3>Change Password</h3>
        </div>
        <div className="main">
          <input
            type="password"
            placeholder="Enter New Password"
            name="password"
            label="Password"
            onChange={onChange}
            value={state.password}
          ></input>
          <input
            type="password"
            placeholder="Enter Confirm Password"
            name="password2"
            label="Password"
            onChange={onChange}
            value={state.password2}
          ></input>
          <button onClick={onClick}>Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
