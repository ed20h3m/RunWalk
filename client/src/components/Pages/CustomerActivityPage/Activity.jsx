import React, { useContext } from "react";
import { AlertContext } from "../../../context/Alert/Alert";
import { AuthContext } from "../../../context/Authentication/AuthState";
import { SessionContext } from "../../../context/Sessions/SessionState";
import "./Activity.css";

// showOverlay

const Activity = ({ activity, setForm, setSession }) => {
  const { ToggleOverlay, ToggleBookForm, isLoading } = useContext(AlertContext);
  const { customer } = useContext(AuthContext);
  const { AddCartItem, ToggleIsBook, Capacities } = useContext(SessionContext);

  const onClick = (e) => {
    while (Capacities.length > 0) {
      Capacities.pop();
    }
    ToggleIsBook(true);
    callAll();
  };
  const addToBasket = () => {
    while (Capacities.length > 0) {
      Capacities.pop();
    }
    ToggleIsBook(false);
    callAll();
  };
  const callAll = () => {
    setSession(activity);
    ToggleBookForm(true);
    ToggleOverlay(true);
  };
  return (
    <div className="activity">
      <div className="activity-header">
        <div className="text">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe aut,
            laudantium dolorem eius nesciunt impedit earum ut, vitae laborum,
            aspernatur obcaecati doloremque error rerum nulla quisquam iusto in
            aliquid quis!
          </p>
        </div>
        <img src={activity.Link} alt="" />
      </div>
      <div className="activity-footer">
        <div className="left">
          <h5>{activity.Duration} mins</h5>
          <h5>{activity.Activity}</h5>
        </div>
        <div className="right">
          <button className="btn-add-basket" onClick={addToBasket}>
            Add to basket
          </button>
          <button onClick={onClick}>
            {customer.isMember ? "Book Now" : `Book for £${activity.Price}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Activity;
