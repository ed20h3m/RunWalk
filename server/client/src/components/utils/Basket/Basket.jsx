import React, { useContext, useEffect } from "react";
import "./Basket.css";
import CartItem from "./CartItem";
import { SessionContext } from "../../../context/Sessions/SessionState";
import { AuthContext } from "../../../context/Authentication/AuthState";
import { AlertContext } from "../../../context/Alert/Alert";

const Basket = () => {
  const { Cart, MakePayment, CheckOut, info } = useContext(SessionContext);
  const { customer, GetCustomer } = useContext(AuthContext);
  const { SetAlert, ToggleOverlay, ToggleBasket } = useContext(AlertContext);
  useEffect(() => {
    if (localStorage.CustomerToken) GetCustomer();
  }, []);
  let total;
  let isDiscount = true;
  let counter = 0;
  for (let i = 0; i < Cart.length; i++) {
    const date1 = new Date(Cart[i].Date);
    const date2 = new Date();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 7) {
      counter++;
    }
  }
  if (counter < 3) isDiscount = false;
  else isDiscount = true;
  if (isDiscount && Cart.length >= 3) {
    total = parseFloat(
      (
        Cart.reduce((a, b) => a + b.Price, 0) *
        (1 - info.Discount / 100)
      ).toFixed(2)
    );
  } else {
    total = parseFloat(Cart.reduce((a, b) => a + b.Price, 0).toFixed(2));
  }
  return (
    <div className="basket">
      <div className="header">
        <h3>Basket</h3>
      </div>
      <div className="main">
        {Cart.map((item, id) => (
          <CartItem item={item} key={id} id={id} />
        ))}
      </div>
      {customer && (
        <div className="footer">
          {!customer.isMember && <h3>Total: £{total}</h3>}
          {!customer.isMember && Cart.length > 2 && (
            <h6>with {info.Discount}%</h6>
          )}
          {!customer.isMember ? (
            <button
              className="check-out-btn"
              onClick={() => {
                if (Cart.length > 0) {
                  MakePayment(Cart);
                } else {
                  SetAlert("Basket Empty", "error");
                }
              }}
            >
              Check out and Pay
            </button>
          ) : (
            <button
              onClick={() => {
                if (Cart.length > 0) {
                  localStorage.setItem("cart", JSON.stringify(Cart));
                  CheckOut();
                  ToggleBasket(false);
                  ToggleOverlay(false);
                } else {
                  SetAlert("Basket Empty", "error");
                }
              }}
              className="check-out-btn"
            >
              Book
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Basket;
