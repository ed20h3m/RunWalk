import React, { Fragment, useState, useContext, useEffect } from "react";
import { SessionContext } from "../../../context/Sessions/SessionState";
import { AlertContext } from "../../../context/Alert/Alert";
import { AuthContext } from "../../../context/Authentication/AuthState";
import Loading from "../../utils/Loading";
import "./BookForm.css";

const BookForm = ({ session }) => {
  const {
    AddCartItem,
    isBook,
    Cart,
    MakePayment,
    CheckOut,
    RemoveCartItem,
    GetCapacities,
    Capacities,
  } = useContext(SessionContext);

  const { customer } = useContext(AuthContext);
  const { ToggleBookForm, ToggleOverlay, SetAlert, isLoadingForm } =
    useContext(AlertContext);
  const cancel = (e) => {
    ToggleBookForm(false);
    ToggleOverlay(false);
  };
  const [state, setState] = useState({ Date: "", Time: "" });
  const create = async () => {
    if (state.Time === "") {
      return SetAlert("Select Time", "warning");
    }
    if (new Date().toISOString().slice(0, 10) > state.Date) {
      return SetAlert("Invalid Date. Try again", "warning");
    }
    if (
      new Date().toISOString().slice(0, 10) === state.Date &&
      new Date().getHours() > Number(state.Time.slice(0, 2))
    ) {
      return SetAlert("Invalid Time. Try again", "warning");
    }
    if (session.Facility === "swimming pool") {
      if (
        Number(state.Time.slice(0, 2)) < 8 ||
        Number(state.Time.slice(0, 2)) > 20
      ) {
        return SetAlert("Invalid Time. Try again", "warning");
      } else if (
        Number(state.Time.slice(0, 2)) < 8 ||
        Number(state.Time.slice(0, 2)) > 22
      ) {
        return SetAlert("Invalid Time. Try again", "warning");
      }
    }

    const oneDay = 24 * 60 * 60 * 1000;

    const days = Math.round(
      Math.abs((new Date() - new Date(state.Date)) / oneDay)
    );
    if (days >= 14) {
      return SetAlert("Invalid Date. Max 2 weeks in advance", "warning");
    }
    setState({ ...state, Date: state.Date });
    session.Date = state.Date;
    session.Time = state.Time;
    // return;
    if (isBook) {
      const isInBasket = await AddCartItem(session);
      if (isInBasket) return;
      if (!customer.isMember) {
        // console.log(session);
        // return;
        MakePayment([session]);
      } else {
        localStorage.setItem("cart", JSON.stringify([session]));
        CheckOut();
      }
    } else {
      const isInBasket = AddCartItem(session);
    }
    // return;
    ToggleBookForm(false);
    ToggleOverlay(false);
  };

  const onChange = (e) => {
    // if (new Date().toISOString().slice(0, 10) > e.target.value) {
    //   return SetAlert("Invalid Date. Try again", "warning");
    // }
    // if (new Date().toISOString().slice(0, 10) === e.target.value) {
    //   return SetAlert("Invalid Time. Try again", "warning");
    // }
    const date1 = new Date();
    const date2 = new Date(e.target.value);
    let diffInDays;
    // if (date1.toISOString().slice(0, 10) !== e.target.value) {
    // }
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date2.getTime() - date1.getTime();
    diffInDays = Math.round(diffInTime / oneDay);
    // console.log(diffInDays);
    if (diffInDays <= -1) {
      return SetAlert("Invalid Date. Try again", "error");
    }
    if (diffInDays > 14) {
      return SetAlert("Invalid Date. Max 2 weeks in advance", "warning");
    }
    // return;
    GetCapacities(e.target.value, session.Facility);
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const selectTime = (e) => {
    const elements = e.target.parentElement.children;
    for (let i = 0; i < elements.length; i++)
      elements[i].classList.remove("selected");
    e.target.classList.add("selected");
    setState({ ...state, [e.target.id]: e.target.innerHTML.slice(0, 5) });
  };
  return (
    <div className="book-form">
      <div className="header">
        <h3>Book session</h3>
        <input
          type="date"
          value={state.Date}
          onChange={onChange}
          name="Date"
        ></input>
      </div>
      <div className="main-con">
        {isLoadingForm ? (
          <Loading />
        ) : Capacities.length > 0 ? (
          <div className="main" id="time-slots">
            {Capacities.map((element, id) => (
              <h6 className="slot" id="Time" onClick={selectTime} key={id}>
                {element.timeSlot.slice(11, 16)} <br /> {element.count} Places
                left
              </h6>
            ))}
          </div>
        ) : (
          <div className="no-slots">
            <h2>Pick a Date</h2>
          </div>
        )}
      </div>
      <div className="footer">
        <Fragment>
          <button className="button btn-delete" onClick={cancel}>
            Cancel
          </button>
          <button className="button btn-update" onClick={create}>
            {isBook ? "Book" : "Add"}
          </button>
        </Fragment>
      </div>
    </div>
  );
};

export default BookForm;
