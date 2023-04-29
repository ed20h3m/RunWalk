import React, { useEffect, useContext, useState } from "react";
import "./BookingCard.css";
import CalendarWidget from "../CalendarWidget/CalendarWidget";
import TimeCards from "../TimeCards/TimeCards";
import { AlertContext } from "../../../../../context/Alert/Alert";
import { SessionContext } from "../../../../../context/Sessions/SessionState";
import { AuthContext } from "../../../../../context/Authentication/AuthState";
const BookingCard = (props) /* Destructuring the props */ => {
  const {
    Activity,
    Duration,
    Price,
  } = props;
  const {OpenTime, CloseTime, ...postProps} = props;
  const {SetAlert} = useContext(AlertContext)
  const {CheckOut, AddCartItem, Cart, SetCart, MakePayment} = useContext(SessionContext)
  const {customer} = useContext(AuthContext)
  const [ updatedDate, setUpdatedDate ] = useState(new Date());
  const [ updatedTime, setUpdatedTime ] = useState(null);

  useEffect(()=>{
    console.log("HERE")
    if(localStorage.getItem('cart'))
    SetCart(JSON.parse(localStorage.getItem('cart')))
  }, [])
 
  return (
    <div className="booking-card">
      <h1>Activity: {Activity}</h1>
      <h1>Duration: {Duration} mins</h1>
      <CalendarWidget Date = {updatedDate} setUpdatedDate ={setUpdatedDate}></CalendarWidget>
      <TimeCards OpenTime = {OpenTime} CloseTime = {CloseTime} Duration = {Duration} setUpdatedTime = {setUpdatedTime}></TimeCards>
      <button className="edit-button" onClick={async ()=>{
        if(updatedTime)
        {
          const session = {...postProps, Date: updatedDate.toISOString().slice(0,10), Time: updatedTime,  Email: localStorage["customer_email"]}
          const unavailable = await AddCartItem(session)
          if(!unavailable)
          {
           
            if (!customer.isMember) {
              MakePayment(Cart);
            }
          else
          {
            localStorage.setItem("cart",  JSON.stringify([session]));
          CheckOut()
          }
          }
        }
        else
        {
         SetAlert("Please select a time") 
        }
      }

        }> {customer.isMember ? "Book Now" : `Book for £ ${Price}`} </button>
      
      <button className="edit-button" onClick = {async ()=>{
        if(updatedTime)
        {
          const session = {...postProps, Date: updatedDate.toISOString().slice(0,10), Time: updatedTime,  Email: localStorage["customer_email"]}
          const unavailable = await AddCartItem(session)
          if(!unavailable)
          {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          // Add a new item to the array
          cart.push(session);
          // Store the updated array back in localStorage
          localStorage.setItem("cart", JSON.stringify(cart));
          }
        }
        else
        {
          SetAlert("Please select a time") 
        }
      }}> Add To Cart</button>
    
    </div>
  );
};

export default BookingCard;
