import React, { useContext, useEffect } from "react";
import { AlertContext } from "./context/Alert/Alert";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import War from "./components/utils/War";
import Overlay from "./components/utils/Overlay";
import Home from "./components/Pages/Home/Home";
import Login from "./components/Pages/Login-Sign up/Login";
import Signup from "./components/Pages/Login-Sign up/Signup";
import Navbar from "./components/utils/Navbar";
import AdminHomePage from "./components/Pages/EmployeeInterface/home page/AdminHomePage/AdminHomepage";
import CustomerHomePage from "./components/Pages/CustomerHomePage/CustomerHomePage";
import Dashboard from "./components/Pages/dashboard/Dashboard";
import Staff from "./components/Pages/staff/Staff";
import CustomerActivityPage from "./components/Pages/CustomerActivityPage/CustomerActivityPage";
import Basket from "./components/utils/Basket/Basket";
import ForgottenPassword from "./components/Pages/ForgottenPassword/ForgottenPassword";
import "./App.css";
import ChangePassword from "./components/Pages/ChangePassword/ChangePassword";
import Order from "./components/Pages/order/Order";
import Pagenotfound from "./components/Pages/pagenotfound/Pagenotfound";
import CustomerProfilePage from "./components/Pages/CustomerProfilePage/CustomerProfilePage";
import Membership from "./components/Pages/membership/Membership";
import Activity from "./components/Pages/activity/Activity";
// import Booking from "./components/Pages/EmployeeInterface/booking page/Booking/Booking";
import Booking from "./components/Pages/EmployeeInterface/Booking page/Booking/Booking";
// import Loading from "./components/utils/Loading";
let stripePromise = loadStripe(
  "pk_test_51MlBZHFi0ADzfbvapM2iGrrCkLELOm5ojI7tcjXmXmN339EMPFQ1msmVIVxwjEjS65uMh90LingiumBCOSSxeHrA00YIG0SI2i"
);

const App = () => {
  const { SetAlert, Alerts, showOverlay } = useContext(AlertContext);
  useEffect(() => {
    const call = async () => {
      let obj;
      if (localStorage.CustomerToken)
        obj = { Token: localStorage.CustomerToken, Person: "Customer" };
      else if (localStorage.EmployeeToken)
        obj = { Token: localStorage.EmployeeToken, Person: "Employee" };
      else if (localStorage.ManagerToken)
        obj = { Token: localStorage.ManagerToken, Person: "Manager" };
      if (obj) {
        const res = await axios.post("/check-jwt", { ...obj });
        if (res.data.type === "error") {
          SetAlert(
            res.data.message === "jwt expired"
              ? "session expired"
              : res.data.message,
            res.data.type
          );
        }
        if (res.data.message === "jwt expired") {
          localStorage.clear();
          window.location.href = "/";
        }
      }
    };
    call();
    // eslint-disable-next-line
  }, []);
  return (
    <BrowserRouter>
      {showOverlay && <Overlay />}
      {!localStorage.ManagerToken && <Navbar />}
      <Basket />
      <War Alerts={Alerts} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={
            <Elements stripe={stripePromise}>
              <CustomerProfilePage />
            </Elements>
          }
        />
        {localStorage.EmployeeToken && (
          <Route path="/employee" element={<AdminHomePage />} />
        )}
        {localStorage.CustomerToken && (
          <Route path="/customer/home" element={<CustomerHomePage />} />
        )}
        {localStorage.CustomerToken && (
          <Route path="/customer/activity" element={<CustomerActivityPage />} />
        )}
        {localStorage.ManagerToken && (
          <Route path="/Dashboard" element={<Dashboard />} />
        )}
        {localStorage.ManagerToken && (
          <Route path="/staff" element={<Staff />} />
        )}
        {localStorage.ManagerToken && (
          <Route path="/activities" element={<Activity />} />
        )}
        {localStorage.ManagerToken && (
          <Route path="/membership" element={<Membership />} />
        )}
        {localStorage.EmployeeToken && (
          <Route path="/employee/booking" element={<Booking />} />
        )}
        {<Route path="/forgotten-password" element={<ForgottenPassword />} />}
        <Route
          path="/change-password/:id/:token"
          element={<ChangePassword />}
        />
        {(localStorage.CustomerToken || localStorage.EmployeeToken) && (
          <Route path="/success" element={<Order />} />
        )}
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
