import React, { useContext, useEffect } from "react";
import Session from "./Session";
import Loading from "../../utils/Loading";
import "./CustomerHomePage.css";
import { AlertContext } from "../../../context/Alert/Alert";
import { AuthContext } from "../../../context/Authentication/AuthState";
import { SessionContext } from "../../../context/Sessions/SessionState";
import Footer from "../../utils/Footer";

const CustomerHomePage = () => {
  const { isLoading } = useContext(AlertContext);

  const { GetSessions, BookedSessions } = useContext(SessionContext);

  const { GetCustomer, customer } = useContext(AuthContext);
  useEffect(() => {
    if (!localStorage.CustomerToken) window.location.href = "/";
    const call = async () => {
      await GetCustomer();
    };
    call();
  }, []);

  useEffect(() => {
    if (customer) GetSessions(customer.Email);
  }, [customer]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="home-page-container">
      <div className="customer-home-page">
        {BookedSessions.length > 0 ? (
          <main>
            {BookedSessions.map((e, id) => (
              <Session session={e} key={id} Email={customer.Email} />
            ))}
          </main>
        ) : (
          <div className="no-booking">
            <h3>No Bookings </h3>
            <h6>
              Navigate to <a href="/customer/activity">Book Activity</a>
            </h6>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CustomerHomePage;
