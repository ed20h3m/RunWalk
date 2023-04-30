import React, { useState, useContext, useEffect } from "react";
import "./AdminHomepage.css";
import Footer from "../../../../utils/Footer";
import Activity from "../Activity/Activity";
import SearchBar from "../SearchBar/SearchBar";
import { SessionContext } from "../../../../../context/Sessions/SessionState";
import { AlertContext } from "../../../../../context/Alert/Alert";
import Loading from "../../../../utils/Loading";
import { useNavigate } from "react-router";
import MembershipButton from "../../Membership/Membership";
import { AuthContext } from "../../../../../context/Authentication/AuthState";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51MlBZHFi0ADzfbvapM2iGrrCkLELOm5ojI7tcjXmXmN339EMPFQ1msmVIVxwjEjS65uMh90LingiumBCOSSxeHrA00YIG0SI2i"
);

const AdminHomepage = () => {
  const options = {
    mode: "payment",
    amount: 1099,
    currency: "gbp",
  };
  const navigate = useNavigate();
  const { BookedSessions, GetSessions, GetInfo } = useContext(SessionContext);
  const { isLoading } = useContext(AlertContext);
  const { customer, GetCustomerDetails } = useContext(AuthContext);
  const [customerEmail, setCustomerEmail] = useState(null);
  useEffect(() => {
    GetInfo();
  }, []);
  useEffect(() => {
    if (localStorage["customer_email"]) {
      setCustomerEmail(localStorage["customer_email"]);
      GetCustomerDetails(localStorage["customer_email"]);
      GetSessions(localStorage["customer_email"]);
    }
  }, []);

  useEffect(() => {
    if (customer?.Email) {
      localStorage.setItem("customer_email", customer.Email);
      setCustomerEmail(customer.Email);
      GetSessions(customer.Email);
    }
  }, [customer]);

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <Elements stripe={stripePromise} options={options}>
        <SearchBar customerEmail={customerEmail} />

        {BookedSessions.length > 0 && customer ? (
          <>
            <div className="activities-container">
              {BookedSessions.map(
                (
                  activity //Rendering each activity component
                ) => (
                  <Activity key={activity._id} {...activity}></Activity>
                )
              )}
            </div>
            <div className="buttons-container">
              <button
                className="click-button"
                onClick={() => {
                  navigate("booking");
                }}
              >
                Book Session
              </button>
              <MembershipButton
                isMember={customer?.isMember}
              ></MembershipButton>
            </div>
          </>
        ) : !BookedSessions.length > 0 && customer ? (
          <div className="buttons-container" style={{ paddingTop: "310px" }}>
            <button
              className="click-button"
              onClick={() => {
                window.location.href = "/employee/booking";
              }}
            >
              Book Session
            </button>
            <MembershipButton isMember={customer?.isMember}></MembershipButton>
          </div>
        ) : (
          <div style={{ paddingBottom: "460px" }}></div>
        )}

        <Footer />
      </Elements>
    </>
  );
};

export default AdminHomepage;
