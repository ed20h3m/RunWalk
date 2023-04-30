import React, { useContext } from "react";
import { SessionContext } from "../../../context/Sessions/SessionState";
import { AuthContext } from "../../../context/Authentication/AuthState";
import "./CartItem.css";

const CartItem = ({ item, id }) => {
  const { RemoveCartItem } = useContext(SessionContext);
  const { customer } = useContext(AuthContext);
  const remove = () => {
    RemoveCartItem(id);
    const storedData = localStorage.getItem("cart");
    let data = [];

    if (storedData) {
      // Parse the stored data as JSON.
      data = JSON.parse(storedData);
    }

    // Find the item to remove based on its id.
    data.splice(id, 1);

    // Store the updated data back in localStorage.
    localStorage.setItem("cart", JSON.stringify(data));
  };
  return (
    <div className="cart-item">
      <h5 className="hide" onClick={remove}>
        Remove
      </h5>
      <div className="mid">
        <h6>{item.Activity}</h6>
        <h6>{item.Facility}</h6>
        <h6>{item.Date + " " + item.Time.slice(0, 3) + "00"}</h6>
        {!customer.isMember ? <h6>£{item.Price}</h6> : <h6>Free</h6>}
      </div>
      <div className="left">
        <img src={item.Link} alt="" />
      </div>
    </div>
  );
};

export default CartItem;
