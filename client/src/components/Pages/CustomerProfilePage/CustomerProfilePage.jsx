import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/Authentication/AuthState";
import { AlertContext } from "../../../context/Alert/Alert";
import Loading from "../../utils/Loading";
import "./CustomerProfilePage.css";
import InputItem from "./InputItem";
import MembershipCard from "./MembershipCard";
import SubCard from "./SubCard";
const srr = require("stripe")(
  "sk_test_51MlBZHFi0ADzfbva1UjwNVVstqe7Jpqh5eaibsM92PmKpBEpUfP81cpAySUDLA4TvyAzjhqiI2qf1kzBeSJgcEiX00OW7ph683"
);

const CustomerProfilePage = () => {
  const [sub, setSub] = useState("");
  const {
    customer,
    GetCustomer,
    PutCustomer,
    SetCustomerId,
    CustomerChangePassword,
  } = useContext(AuthContext);
  const { isLoading } = useContext(AlertContext);
  useEffect(() => {
    GetCustomer();
  }, []);
  const [inEdit, setInEdit] = useState(false);
  const [plan, setPlan] = useState("");
  const [inPasswordEdit, setInPasswordEdit] = useState(false);
  const [state, setState] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
  });
  const [password, setPassword] = useState({
    Password: "",
    NewPassword: "",
  });

  useEffect(() => {
    async function call() {
      const subscription = await srr.subscriptions.retrieve(customer.subId);
      setSub(
        new Date(subscription.current_period_end * 1000)
          .toISOString()
          .slice(0, 10)
      );
      setPlan(subscription.plan.interval);
    }
    if (customer) call();
  }, [customer]);

  useEffect(() => {
    setAttributes();
  }, [customer]);
  const setAttributes = () => {
    setState({
      FirstName: customer ? customer.FirstName : "",
      LastName: customer ? customer.LastName : "",
      Email: customer ? customer.Email : "",
    });
  };
  const ResetAttributes = () => {
    setPassword({
      Password: "",
      NewPassword: "",
    });
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const ChangeDetails = async () => {
    SetCustomerId();
    await PutCustomer(state);
    await GetCustomer();
  };

  const onChangePassword = async (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };
  const ChangePassword = async () => CustomerChangePassword(password);

  const DeleteSub = async () => {
    const deleted = await srr.subscriptions.del(customer.subId);
    PutCustomer({ subId: ".", isMember: false });
    window.location.reload(false);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="profile-page">
      <div className="main">
        <h3 className="header-title">Personal Details</h3>
        <InputItem
          name="FirstName"
          label="First Name"
          attribute={
            inEdit ? state.FirstName : customer ? customer.FirstName : ""
          }
          onChange={onChange}
          inEdit={inEdit}
          type="text"
        />
        <InputItem
          name="LastName"
          label="Last Name"
          attribute={
            inEdit ? state.LastName : customer ? customer.LastName : ""
          }
          onChange={onChange}
          inEdit={inEdit}
          type="text"
        />
        <InputItem
          name="Email"
          label="Email"
          attribute={inEdit ? state.Email : customer ? customer.Email : ""}
          onChange={onChange}
          inEdit={inEdit}
          type="Email"
        />
        {inEdit ? (
          <div>
            <button
              className="edit-btn cancel-btn"
              onClick={() => {
                setAttributes();
                setInEdit(false);
              }}
            >
              Cancel
            </button>
            <button
              className="edit-btn update-btn"
              onClick={() => {
                ChangeDetails();
                setInEdit(false);
              }}
            >
              Update
            </button>
          </div>
        ) : (
          <button className="edit-btn" onClick={() => setInEdit(true)}>
            Edit Profile
          </button>
        )}
        <InputItem
          name="Password"
          label="Current Password"
          onChange={onChangePassword}
          attribute={password.Password}
          inEdit={inPasswordEdit}
          type="password"
        />
        {inPasswordEdit && (
          <InputItem
            name="NewPassword"
            label="New Password"
            onChange={onChangePassword}
            attribute={password.NewPassword}
            inEdit={inPasswordEdit}
            type="password"
          />
        )}
        {!inPasswordEdit ? (
          <button
            className="edit-btn change-password-btn"
            onClick={() => setInPasswordEdit(true)}
          >
            Change Password
          </button>
        ) : (
          <div>
            <button
              className="edit-btn cancel-btn"
              onClick={() => {
                ResetAttributes();
                setInPasswordEdit(false);
              }}
            >
              Cancel
            </button>
            <button
              className="edit-btn update-btn"
              onClick={async () => {
                const isChanged = await ChangePassword();
                if (isChanged) {
                  setInPasswordEdit(false);
                  ResetAttributes();
                }
              }}
            >
              Update
            </button>
          </div>
        )}
        {customer && customer.isMember && (
          <div className="btn-con">
            <div className="sub-status">
              <h5>
                {plan === "month"
                  ? "Monthly Subscription"
                  : "Annual Subscription"}
              </h5>
              <h6>
                Next Payment:{" "}
                {sub.split("-").reverse().join("-").replaceAll("-", "/")}
              </h6>
            </div>
            <button className="sub-btn" onClick={DeleteSub}>
              Cancel Subscription
            </button>
          </div>
        )}
        {customer && !customer.isMember && <MembershipCard />}
        {customer && !customer.isMember && <SubCard />}
      </div>
    </div>
  );
};

export default CustomerProfilePage;
