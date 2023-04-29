import axios from "axios";
import { createContext, useContext, useReducer } from "react";
import SessionReducer from "./SessionsReducer";
import { SessionSchema, SessionSchemaPut } from "../Schemas/SessionSchema";
import { AlertContext } from "../Alert/Alert";
import { AuthContext } from "../Authentication/AuthState";
import { EmailSchema } from "../Schemas/AttSchema";
import {
  SET_POOL_SESSIONS,
  SET_STUDIO_SESSIONS,
  SET_CLIMBING_SESSIONS,
  SET_SQUASH_COURT_1_SESSIONS,
  SET_SQUASH_COURT_2_SESSIONS,
  SET_CAPACITIES,
  SET_SPORTS_HALL_SESSIONS,
  SET_FITNESS_ROOM_SESSIONS,
  SET_BOOKED_SESSIONS,
  ADD_CART_ITEM,
  REMOVE_CART_ITEM,
  SET_IS_BOOK,
  SET_INFO,
  SET_BOOKED_TIME,
  SET_CART,
} from "../types";

export const SessionContext = createContext();

export const SessionState = (props) => {
  const initialState = {
    BookedSessions: [],
    PoolSessions: [], // 1
    StudioSessions: [], // 2
    ClimbingWallSessions: [], // 3
    SquashCourt1Sessions: [], // 4
    SquashCourt2Sessions: [], // 5
    FitnessRoomSessions: [], // 6
    SportsHallSessions: [], // 7
    Capacities: [], //8
    Cart: [],
    isBook: false,
    info: {},
    BookedTime: "",
  };
  const { SetAlert, ToggleLoading, ToggleLoadingForm } =
    useContext(AlertContext);
  const { customer } = useContext(AuthContext);

  const [state, dispatch] = useReducer(SessionReducer, initialState);
  // create a new sessions
  const PostSession = async (session) => {
    // session.Email = customer.Email;
    session.Date = session.Date + " " + session.Time.slice(0, 3) + "00";
    delete session.Time;
    delete session.Link;
    // Check if manager or customer are logged in
    if (!localStorage.EmployeeToken && !localStorage.CustomerToken)
      return SetAlert("Authentication required"); // return error if tokens are not found
    let path;
    // Change the paths accordingly
    if (localStorage.EmployeeToken) path = "/sessions/employee";
    else path = "/sessions/customer";
    // Check session syntax
    const { error } = SessionSchema.validate(session);
    // return if error
    if (error)
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    // if no session is provided return error
    if (!session) return SetAlert("Invalid session provided", "error");
    try {
      // set header to the request object
      if (localStorage.CustomerToken)
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      ToggleLoading(true);
      const res = await axios.post(path, { ...session });
      ToggleLoading(false);
      // SetAlert("Session Booked", "success");
    } catch ({ response }) {
      // check if there is an error
      SetAlert(response.data.message);
    }
  };
  // amend sessions
  const EditSession = async (session) => {
    session.Email = customer.Email;

    if (session.Status === "pending") {
      session.Date = session.Date + " " + session.Time.slice(0, 3) + "00";
      delete session.Time;
    }
    if (!localStorage.EmployeeToken && !localStorage.CustomerToken)
      return SetAlert("Authentication required"); // return error if tokens are not found
    let path;
    // Change the paths accordingly
    if (localStorage.EmployeeToken) path = "/sessions/employee";
    else path = "/sessions/customer";
    // session = {
    //   _id: "63fa2804de5459a914660e6b",
    //   Email: "hm.mousavi.02@gmail.com",
    //   Status: "pending",
    // };
    // check for syntax errors
    const { error } = SessionSchemaPut.validate(session);
    // return if error
    if (error)
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    // if no session is provided return error
    if (!session) return SetAlert("Invalid session provided", "error");
    try {
      // set header to the request object
      if (localStorage.CustomerToken)
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      const res = await axios.put(path, { session });
      // log the response
      SetAlert(res.data.message, res.data.type);
    } catch ({ response }) {
      // check if there is an error
      SetAlert(response.data.message);
    }
  };
  // Delete Session
  const DeleteSession = async (session) => {
    session.Status = "canceled";
    await EditSession(session);
  };
  // get all sessions
  const GetSessions = async (Email) => {
    const { error } = EmailSchema.validate({ Email });
    if (error)
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    if (!localStorage.EmployeeToken && !localStorage.CustomerToken)
      return SetAlert("Authentication required"); // return error if tokens are not found
    let path;
    // Change the paths accordingly
    if (localStorage.EmployeeToken) path = "/sessions/employee";
    else path = "/sessions/customer";
    try {
      axios.defaults.headers.common["Email"] = Email;
      if (localStorage.CustomerToken)
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      ToggleLoading(true);
      const res = await axios.get(path);
      ToggleLoading(false);
      if (res.data.data.length === 0)
        SetAlert("No sessions found for this customer", res.data.type);
      dispatch({ type: SET_BOOKED_SESSIONS, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // Used to get all sessions
  const GetCapacities = async (Date, Facility) => {
    try {
      // Set headers to filter search
      let path;
      axios.defaults.headers.common["Facility"] = Facility.toLowerCase();
      axios.defaults.headers.common["time"] = Date;
      // set token
      if (localStorage.CustomerToken) {
        path = "/sessions/customer/all-sessions";
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      } else {
        path = "/sessions/employee/all-sessions";
        axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      }
      // Make request to the backend
      // ToggleLoading(true);
      ToggleLoadingForm(true);
      const res = await axios.get(path);
      ToggleLoadingForm(false);
      // ToggleLoading(false);
      // store data
      dispatch({ type: SET_CAPACITIES, payload: res.data.data });
      return res.data.data.count;
    } catch (error) {
      // alert if error
      SetAlert(error.message);
    }
    ToggleLoadingForm(false);
  };
  // Get pool sessions
  const GetPoolSessions = async () => {
    if (!localStorage.EmployeeToken && !localStorage.CustomerToken)
      return SetAlert("Authentication required"); // return error if tokens are not found
    let path;
    // Change the paths accordingly
    if (localStorage.EmployeeToken) path = "/sessions/employee/pool";
    else if (localStorage.CustomerToken) path = "/sessions/customer/pool";
    try {
      // Set token accordingly
      if (localStorage.CustomerToken)
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      // Make backend request
      ToggleLoading(true);
      const res = await axios.get(path);
      // Store sessions in state
      dispatch({ type: SET_POOL_SESSIONS, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
    ToggleLoading(false);
  };
  // Get Studio Sessions
  const GetStudioSessions = async () => {
    if (!localStorage.EmployeeToken && !localStorage.CustomerToken)
      return SetAlert("Authentication required"); // return error if tokens are not found
    let path;
    // Change the paths accordingly
    if (localStorage.EmployeeToken) path = "/sessions/employee/studio";
    else if (localStorage.CustomerToken) path = "/sessions/customer/studio";
    try {
      // Set token accordingly
      if (localStorage.CustomerToken)
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      // Make backend request
      const res = await axios.get(path);
      // Store sessions in state
      dispatch({ type: SET_STUDIO_SESSIONS, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // Get climbing wall sessions
  const GetClimbingWallSessions = async () => {
    if (!localStorage.EmployeeToken && !localStorage.CustomerToken)
      return SetAlert("Authentication required"); // return error if tokens are not found
    let path;
    // Change the paths accordingly
    if (localStorage.EmployeeToken) path = "/sessions/employee/climbing-wall";
    else if (localStorage.CustomerToken)
      path = "/sessions/customer/climbing-wall";
    try {
      // Set token accordingly
      if (localStorage.CustomerToken)
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      // Make backend request
      const res = await axios.get(path);
      // Store sessions in state
      dispatch({ type: SET_CLIMBING_SESSIONS, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // get squash court 1 sessions
  const GetSquashCourt1Sessions = async () => {
    if (!localStorage.EmployeeToken && !localStorage.CustomerToken)
      return SetAlert("Authentication required"); // return error if tokens are not found
    let path;
    // Change the paths accordingly
    if (localStorage.EmployeeToken) path = "/sessions/employee/squash-court1";
    else if (localStorage.CustomerToken)
      path = "/sessions/customer/squash-court1";
    try {
      // Set token accordingly
      if (localStorage.CustomerToken)
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      // Make backend request
      const res = await axios.get(path);
      // Store sessions in state
      dispatch({ type: SET_SQUASH_COURT_1_SESSIONS, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // get squash court sessions
  const GetSquashCourt2Sessions = async () => {
    if (!localStorage.EmployeeToken && !localStorage.CustomerToken)
      return SetAlert("Authentication required"); // return error if tokens are not found
    let path;
    // Change the paths accordingly
    if (localStorage.EmployeeToken) path = "/sessions/employee/squash-court2";
    else if (localStorage.CustomerToken)
      path = "/sessions/customer/squash-court2";
    try {
      // Set token accordingly
      if (localStorage.CustomerToken)
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      // Make backend request
      const res = await axios.get(path);
      // Store sessions in state
      dispatch({ type: SET_SQUASH_COURT_2_SESSIONS, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // get sports hall sessions
  const GetSportsHallSessions = async () => {
    if (!localStorage.EmployeeToken && !localStorage.CustomerToken)
      return SetAlert("Authentication required"); // return error if tokens are not found
    let path;
    // Change the paths accordingly
    if (localStorage.EmployeeToken) path = "/sessions/employee/sports-hall";
    else if (localStorage.CustomerToken)
      path = "/sessions/customer/sports-hall";
    try {
      // Set token accordingly
      if (localStorage.CustomerToken)
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      // Make backend request
      const res = await axios.get(path);
      // Store sessions in state
      dispatch({ type: SET_SPORTS_HALL_SESSIONS, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // get fitness room sessions
  const GetFitnessRoomSessions = async () => {
    if (!localStorage.EmployeeToken && !localStorage.CustomerToken)
      return SetAlert("Authentication required"); // return error if tokens are not found
    let path;
    // Change the paths accordingly
    if (localStorage.EmployeeToken) path = "/sessions/employee/fitness-room";
    else if (localStorage.CustomerToken)
      path = "/sessions/customer/fitness-room";
    try {
      // Set token accordingly
      if (localStorage.CustomerToken)
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      // Make backend request
      const res = await axios.get(path);
      // Store sessions in state
      dispatch({ type: SET_FITNESS_ROOM_SESSIONS, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // make payment

  const SetCart = async (items) => {
    dispatch({ type: SET_CART, payload: items });
  };
  const MakePayment = async (items) => {
    if (!localStorage.EmployeeToken && !localStorage.CustomerToken)
      return SetAlert("Authentication required"); // return error if tokens are not found
    let path;
    // Change the paths accordingly
    if (localStorage.EmployeeToken) path = "/payment/employee";
    else path = "/payment/customer";
    try {
      if (localStorage.CustomerToken)
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      if (items.length >= 3) {
        let counter = 0;
        let isDiscount = true;
        for (let i = 0; i < items.length; i++) {
          const date1 = new Date(items[i].Date);
          const date2 = new Date();
          const diffTime = Math.abs(date2 - date1);
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays >= 7) {
            counter++;
          }
        }
        if (counter >= 3) {
          items.forEach((item) => {
            item.Price = parseFloat(
              (item.Price * (1 - state.info.Discount / 100)).toFixed(2)
            );
          });
        }
      }
      // return;
      const res = await axios.post(path, { items });
      SetAlert("Redirecting to checkout page", res.data.type);
      if (res.data.url) {
        localStorage.setItem("cart", JSON.stringify(items));
        localStorage.setItem("isMember", customer.isMember);
        window.location.href = res.data.url;
      }
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // check out all items in basket
  const CheckOut = async () => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    ToggleLoading(true);
    items.forEach(async (item) => {
      item.Activity.toLowerCase();
      await PostSession(item);
    });
    ToggleLoading(false);
    await SendEmail(items[0].Email, items);
    SetAlert("Sessions Booked", "success");
    if (localStorage.isMember === "false") {
      MakeTransactions();
    }
    localStorage.removeItem("cart");
    localStorage.removeItem("isMember");
    // SEND EMAIL HERE
    setTimeout(() => {
      if (localStorage.CustomerToken) window.location.href = "/customer/home";
      else if (localStorage.EmployeeToken) {
        window.location.href = "/employee";
      }
    }, 2000);
  };
  // Adds item to basket
  const AddCartItem = async (item) => {
    item.Email = customer.Email;
    const dateTime = item.Date + " " + item.Time.slice(0, 3) + "00";
    const response = await CheckTeamEvents(dateTime, item.Facility);
    // console.log(response);
    // return
    if (response === "Exits") {
      SetAlert("Facility is booked for that time slot", "error");
      return true;
    }
    const count = await GetCapacities(dateTime, item.Facility);
    if (count <= 1) {
      SetAlert("Facility is Fully Booked, Try a different time.", "error");
      return true;
    }
    let Exits = false;
    for (let i = 0; i < state.Cart.length; i++) {
      const dateTimeCart =
        state.Cart[i].Date + " " + state.Cart[i].Time.slice(0, 3) + "00";
      if (dateTimeCart === dateTime) {
        Exits = true;
      }
    }
    if (Exits) return SetAlert("Item Exits in Basket", "error");
    let path;
    if (localStorage.CustomerToken) path = "/sessions/customer/check-session";
    else if (localStorage.EmployeeToken) {
      path = "/sessions/employee/check-session";
    }
    const res = await axios.post(path, {
      ...item,
    });
    if (res.data.message === "Exits") {
      SetAlert("A session is already booked for this time slot", "error");
      return true;
    }
    let isInBasket = false;
    state.Cart.forEach((element) => {
      if (
        element.Date + " " + element.Time.slice(0, 3) + "00" === dateTime &&
        element.Facility === item.Facility &&
        element.Activity === item.Activity
      )
        isInBasket = true;
      else isInBasket = false;
    });
    if (!isInBasket) {
      state.Cart.push(item);
    } else return SetAlert("Item Already in Basket", "error");
    dispatch({ type: ADD_CART_ITEM, payload: state.Cart });
    SetAlert("Item Added to basket", "success");
    return false;
  };
  // removes item from basket
  const RemoveCartItem = (index) => {
    state.Cart.splice(index, 1);
    dispatch({ type: REMOVE_CART_ITEM, payload: state.Cart });
    SetAlert("Item Removed", "error");
  };
  // toggles booking form
  const ToggleIsBook = (option) => {
    dispatch({ type: SET_IS_BOOK, payload: option });
  };
  // sends transaction  email
  const SendEmail = async (Email, items) => {
    try {
      if (localStorage.CustomerToken)
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      const res = await axios.post("/email", { Email, items });
      SetAlert(res.data.message, res.data.type);
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // Create Transaction
  const MakeTransactions = async () => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    if (items.length < 1) return SetAlert("No Items Found", "error");
    let path;
    if (localStorage.CustomerToken) path = "/transactions/customer";
    else if (localStorage.EmployeeToken) path = "/transactions/employee";
    const res = await axios.post(path, { Email: items[0].Email, Items: items });
  };
  // Get sports center info
  const GetInfo = async () => {
    if (!localStorage.EmployeeToken && !localStorage.CustomerToken)
      return SetAlert("Authentication required"); // return error if tokens are not found
    let path;
    // Change the paths accordingly
    if (localStorage.EmployeeToken) path = "/info/employee";
    else path = "/info/customer";

    if (localStorage.CustomerToken)
      axios.defaults.headers.common["token"] = localStorage.CustomerToken;
    else axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
    try {
      const res = await axios.get(path);
      dispatch({ type: SET_INFO, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message, response.data.type);
    }
  };
  // Check for team event bookings
  const CheckTeamEvents = async (Date, Facility) => {
    let path;
    try {
      if (localStorage.CustomerToken) {
        path = "/sessions/customer/team-events";
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      } else {
        path = "/sessions/customer/team-events";
        axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      }
      ToggleLoading(true);
      const res = await axios.post(path, { Date, Facility });
      dispatch({ type: SET_BOOKED_TIME, payload: Date });
      ToggleLoading(false);
      return res.data.message;
    } catch ({ response }) {
      SetAlert(response.data.message, response.data.type);
    }
  };
  return (
    <SessionContext.Provider
      value={{
        EditSession,
        PostSession,
        GetSessions,
        DeleteSession,
        GetCapacities,
        GetPoolSessions,
        GetStudioSessions,
        GetClimbingWallSessions,
        GetSquashCourt1Sessions,
        GetSquashCourt2Sessions,
        GetSportsHallSessions,
        GetFitnessRoomSessions,
        MakePayment,
        CheckOut,
        AddCartItem,
        RemoveCartItem,
        ToggleIsBook,
        SendEmail,
        SetCart,
        MakeTransactions,
        GetInfo,
        CheckTeamEvents,

        Capacities: state.Capacities,
        SportsHallSessions: state.SportsHallSessions,
        PoolSessions: state.PoolSessions,
        StudioSessions: state.StudioSessions,
        ClimbingWallSessions: state.ClimbingWallSessions,
        SquashCourt1Sessions: state.SquashCourt1Sessions,
        SquashCourt2Sessions: state.SquashCourt2Sessions,
        FitnessRoomSessions: state.FitnessRoomSessions,
        Cart: state.Cart,
        BookedSessions: state.BookedSessions,
        isBook: state.isBook,
        info: state.info,
        BookedTime: state.BookedTime,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
};
