import React, { useEffect, useContext, useState } from "react";
import "./BookingCard.css";
import CalendarWidget from "../CalendarWidget/CalendarWidget";
import TimeCards from "../TimeCards/TimeCards";
import { AlertContext } from "../../../../../context/Alert/Alert";
import { SessionContext } from "../../../../../context/Sessions/SessionState";
import { AuthContext } from "../../../../../context/Authentication/AuthState";
import { Grid } from "@mui/material";
const BookingCard = (props) /* Destructuring the props */ => {
  const { Activity, Duration, Price } = props;
  const { OpenTime, CloseTime, ...postProps } = props;
  const { SetAlert } = useContext(AlertContext);
  const { CheckOut, AddCartItem, Cart, SetCart, MakePayment, GetInfo } =
    useContext(SessionContext);
  const { customer } = useContext(AuthContext);
  const [updatedDate, setUpdatedDate] = useState(new Date());
  const [updatedTime, setUpdatedTime] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("cart"))
      SetCart(JSON.parse(localStorage.getItem("cart")));
  }, []);
  useEffect(() => {
    GetInfo();
  }, []);
  return (
    <div className="booking-card">
      <Grid container spacing={2} style={{ textAlign: "left" }}>
        {" "}
        <Grid item xs={12} sm={6} md={6} className="align-left">
          <h1 className="h1-title">Activity </h1>
        </Grid>{" "}
        <Grid item xs={12} sm={6} md={6} className="align-left">
          {" "}
          <h1 className="h1-title">{Activity} </h1>
        </Grid>{" "}
        <Grid item xs={12} sm={6} md={6} className="align-top">
          <h1 className="h1-title"> Duration </h1>
        </Grid>
        <Grid item xs={12} sm={6} md={6} className="align-top">
          <h1 className="h1-title">{Duration} mins </h1>
        </Grid>
        <Grid item xs={12} sm={12} md={12} className="align-top">
          <CalendarWidget
            Date={updatedDate}
            setUpdatedDate={setUpdatedDate}
          ></CalendarWidget>
        </Grid>{" "}
      </Grid>

      <TimeCards
        OpenTime={OpenTime}
        CloseTime={CloseTime}
        Duration={Duration}
        setUpdatedTime={setUpdatedTime}
      ></TimeCards>
      <Grid container spacing={2} className="align-button">
        <Grid item xs={12} sm={12} md={6} lg={6} className="align-left">
          <button
            className="edit-button"
            onClick={async () => {
              if (updatedTime) {
                const session = {
                  ...postProps,
                  Date: new Date(updatedDate)
                    .toLocaleDateString("en-CA")
                    .replace(/\//g, "-"),
                  Time: updatedTime,
                  Email: localStorage["customer_email"],
                };
                const now = new Date();
                const hours = now.getHours().toString().padStart(2, "0");
                const minutes = now.getMinutes().toString().padStart(2, "0");
                const newTime = `${hours}:${minutes}`;
                const year = now.getFullYear();
                const month = (now.getMonth() + 1).toString().padStart(2, "0");
                const day = now.getDate().toString().padStart(2, "0");
                const newDate = `${year}-${month}-${day}`;

                if (session.Time < newTime && newDate === session.Date) {
                  SetAlert("Invalid timeslot! Please choose a valid timeslot");
                } else {
                  const unavailable = await AddCartItem(session);
                  if (unavailable === false) {
                    if (!customer.isMember) {
                      MakePayment(Cart);
                    } else {
                      localStorage.setItem("cart", JSON.stringify([session]));
                      CheckOut();
                    }
                  }
                }
              } else {
                SetAlert("Please select a time");
              }
            }}
          >
            {" "}
            {customer.isMember ? "Book Now" : `Book for £${Price}`}{" "}
          </button>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} className="add-to-cart">
          <button
            className="edit-button"
            onClick={async () => {
              if (updatedTime) {
                const session = {
                  Date: new Date(updatedDate)
                    .toLocaleDateString("en-CA")
                    .replace(/\//g, "-"),
                  Time: updatedTime,
                  Email: localStorage["customer_email"],
                  ...postProps,
                };
                const now = new Date();
                const hours = now.getHours().toString().padStart(2, "0");
                const minutes = now.getMinutes().toString().padStart(2, "0");
                const newTime = `${hours}:${minutes}`;
                const year = now.getFullYear();
                const month = (now.getMonth() + 1).toString().padStart(2, "0");
                const day = now.getDate().toString().padStart(2, "0");
                const newDate = `${year}-${month}-${day}`;

                if (session.Time < newTime && newDate === session.Date) {
                  SetAlert("Invalid timeslot! Please choose a valid timeslot");
                } else {
                  const unavailable = await AddCartItem(session);
                  if (unavailable === false) {
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];
                    // Add a new item to the array
                    cart.push(session);
                    // Store the updated array back in localStorage
                    localStorage.setItem("cart", JSON.stringify(cart));
                  }
                }
              } else {
                SetAlert("Please select a time");
              }
            }}
          >
            {" "}
            Add To Cart
          </button>
        </Grid>{" "}
      </Grid>
    </div>
  );
};

export default BookingCard;