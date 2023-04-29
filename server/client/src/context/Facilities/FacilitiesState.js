import { createContext, useContext, useReducer } from "react";
import axios from "axios";
import FacilitiesReducer from "./FacilitiesReducer";
import { AlertContext } from "../Alert/Alert";
import {
  SET_POOL,
  SET_STUDIO,
  SET_FITNESS_ROOM,
  SET_SPORTS_HALL,
  SET_SQUASH_COURT_1,
  SET_SQUASH_COURT_2,
  SET_CLIMBING_WALL,
  POOL,
  STUDIO,
  FITNESS_ROOM,
  SPORTS_HALL,
  SQUASH_COURT_1,
  SQUASH_COURT_2,
  CLIMBING_WALL,
  SET_INFO,
  SET_BOOKED_SESSIONS_STATS,
  SET_FACILITY_ACTIVITY_STATS,
  SET_TOTAL_PROFIT,
  SET_TOTAL_PROFIT_FACILITY,
  SET_TOTAL_PROFIT_ACTIVITY,
  SET_TOTAL_PROFIT_PER_FACILITY_PER_ACTIVITY,
  TOTAL_NUMBER_OF_CUSTOMER,
  TOTAL_NUMBER_OF_MEMBERS,
  TOTAL_NUMBER_OF_NON_MEMBERS,
  SET_TOTAL_PROFIT_All_FACILITIES,
  SET_TOTAL_PROFIT_All_ACTIVITIES,
  SET_ALL_FACILITIES,
} from "../types";
export const FacilitiesContext = createContext();
export const FacilitiesState = (props) => {
  const initialState = {
    Studio: {},
    Pool: {},
    FitnessRoom: {},
    ClimbingWall: {},
    SquashCourt1: {},
    SquashCourt2: {},
    SportsHall: {},
    TotalBookedSessions: [],
    FacilityActivityStats: [],
    TotalProfit: [],
    TotalProfitPerFacility: [],
    TotalProfitAllFacilities: [],
    TotalProfitAllActivities: [],
    TotalProfitPerActivity: [],
    TotalProfitFacilityPerActivity: [],
    TotalNumberOfCustomers: [],
    TotalNumberOfMembers: [],
    TotalNumberOfNonMembers: [],
    AllFacilities: [],
    Info: {},
  };
  const [state, dispatch] = useReducer(FacilitiesReducer, initialState);
  const { SetAlert, ToggleLoading } = useContext(AlertContext);

  const GetFacility = async (facility) => {
    let path;
    // Check if manager is logged in and authenticated
    if (
      localStorage.ManagerToken ||
      localStorage.CustomerToken ||
      localStorage.EmployeeToken
    ) {
      // Set token to request header
      let token;
      if (localStorage.CustomerToken) {
        token = localStorage.CustomerToken;
        path = `/${facility}/management/customer`;
      } else if (localStorage.EmployeeToken) {
        path = `/${facility}/management/employee`;
        token = localStorage.EmployeeToken;
      } else if (localStorage.ManagerToken) {
        token = localStorage.ManagerToken;
        path = `/${facility}/management`;
      }
      axios.defaults.headers.common["token"] = token;
    } else return SetAlert("No Permission"); // return error if there isn't a token
    try {
      const res = await axios.get(path);

      if (facility === POOL)
        dispatch({ type: SET_POOL, payload: res.data.data });
      else if (facility === STUDIO)
        dispatch({ type: SET_STUDIO, payload: res.data.data });
      else if (facility === FITNESS_ROOM)
        dispatch({ type: SET_FITNESS_ROOM, payload: res.data.data });
      else if (facility === SPORTS_HALL)
        dispatch({ type: SET_SPORTS_HALL, payload: res.data.data });
      else if (facility === SQUASH_COURT_1)
        dispatch({ type: SET_SQUASH_COURT_1, payload: res.data.data });
      else if (facility === SQUASH_COURT_2)
        dispatch({ type: SET_SQUASH_COURT_2, payload: res.data.data });
      else if (facility === CLIMBING_WALL)
        dispatch({ type: SET_CLIMBING_WALL, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };

  const GetAllFacilities = async () => {
    if (localStorage.ManagerToken) {
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    } else return SetAlert("No Permission"); // return error if there isn't a token
    try {
      ToggleLoading(true);
      const res = await axios.get("stats/get-all-facility-info");
      dispatch({ type: SET_ALL_FACILITIES, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
    ToggleLoading(false);
  };

  const PutFacility = async (facility, update = null) => {
    // Check if manager is logged in and authenticated
    if (localStorage.ManagerToken)
      // Set token to request header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    else return SetAlert("No Permission"); // return error if there isn't a token
    try {
      const res1 = await axios.get(`/${facility.replace(" ", "-")}/management`);
      delete res1.data.data._id;
      delete res1.data.data.__v;
      delete res1.data.data.OpenTime;
      delete res1.data.data.CloseTime;
      res1.data.data.Capacity = update.Capacity;
      for (let i = 0; i < res1.data.data.Activities.length; i++) {
        if (res1.data.data.Activities[i].Activity === update.Activity) {
          res1.data.data.Activities[i].Activity = update.Activity;
          res1.data.data.Activities[i].Price = update.Price;
          res1.data.data.Activities[i].Duration = update.Duration;
          res1.data.data.Activities[i].Link = update.Link;
          res1.data.data.Activities[i].Facility = update.Facility;
        }
      }
      // console.log(res1.data.data);
      // return;
      const res = await axios.put(`/${facility.replace(" ", "-")}/management`, {
        update: res1.data.data,
      });
      // console.log(res.data);
      SetAlert(res.data.message, res.data.type);
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };

  const GetBookedSessions = async (Date1, Date2) => {
    if (localStorage.ManagerToken)
      // Set token to request header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    else return SetAlert("No Permission"); // return error if there isn't a token
    try {
      const res = await axios.post("/stats/get-session", { Date1, Date2 });
      dispatch({ type: SET_BOOKED_SESSIONS_STATS, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message, response.data.type);
    }
  };

  const GetFacilityActivity = async (Date1, Date2, Facility) => {
    if (localStorage.ManagerToken)
      // Set token to request header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    else return SetAlert("No Permission"); // return error if there isn't a token
    try {
      const res = await axios.post("/stats/get-facility-activity", {
        Date1,
        Date2,
        Facility,
      });
      dispatch({ type: SET_FACILITY_ACTIVITY_STATS, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message, response.data.type);
    }
  };

  const TotalProfitMade = async (Date1, Date2) => {
    if (localStorage.ManagerToken)
      // Set token to request header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    else return SetAlert("No Permission"); // return error if there isn't a token
    try {
      const res = await axios.post("/stats/total-profit", {
        Date1,
        Date2,
      });
      dispatch({ type: SET_TOTAL_PROFIT, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message, response.data.type);
    }
  };

  const TotalProfitMadePerFacility = async (Date1, Date2, Facility) => {
    if (localStorage.ManagerToken)
      // Set token to request header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    else return SetAlert("No Permission"); // return error if there isn't a token
    try {
      const res = await axios.post("/stats/total-profit-made-per-facility", {
        Date1,
        Date2,
        Facility,
      });
      dispatch({ type: SET_TOTAL_PROFIT_FACILITY, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message, response.data.type);
    }
  };

  const TotalProfitMadeAllFacilities = async (Date1, Date2) => {
    if (localStorage.ManagerToken)
      // Set token to request header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    else return SetAlert("No Permission"); // return error if there isn't a token
    try {
      const res = await axios.post("/stats/total-profit-made-all-facility", {
        Date1,
        Date2,
      });
      dispatch({
        type: SET_TOTAL_PROFIT_All_FACILITIES,
        payload: res.data.data,
      });
    } catch ({ response }) {
      SetAlert(response.data.message, response.data.type);
    }
  };

  const TotalProfitMadeAllActivities = async (Date1, Date2) => {
    if (localStorage.ManagerToken)
      // Set token to request header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    else return SetAlert("No Permission"); // return error if there isn't a token
    try {
      const res = await axios.post("/stats/total-profit-made-all-activity", {
        Date1,
        Date2,
      });
      dispatch({
        type: SET_TOTAL_PROFIT_All_ACTIVITIES,
        payload: res.data.data,
      });
    } catch ({ response }) {
      SetAlert(response.data.message, response.data.type);
    }
  };

  const TotalProfitMadePerActivity = async (Date1, Date2, Activity) => {
    if (localStorage.ManagerToken)
      // Set token to request header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    else return SetAlert("No Permission"); // return error if there isn't a token
    try {
      const res = await axios.post("/stats/total-profit-made-per-activity", {
        Date1,
        Date2,
        Activity,
      });
      dispatch({ type: SET_TOTAL_PROFIT_ACTIVITY, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message, response.data.type);
    }
  };

  const TotalProfitPerFacilityPerActivity = async (
    Date1,
    Date2,
    Facility,
    Activity
  ) => {
    if (localStorage.ManagerToken)
      // Set token to request header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    else return SetAlert("No Permission"); // return error if there isn't a token
    try {
      const res = await axios.post(
        "/stats/total-profit-made-per-facility-per-activity",
        {
          Date1,
          Date2,
          Facility,
          Activity,
        }
      );
      dispatch({
        type: SET_TOTAL_PROFIT_PER_FACILITY_PER_ACTIVITY,
        payload: res.data.data,
      });
    } catch ({ response }) {
      SetAlert(response.data.message, response.data.type);
    }
  };

  const GetNumberOfCustomers = async (Date1, Date2, isMember = null) => {
    if (localStorage.ManagerToken)
      // Set token to request header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    else return SetAlert("No Permission"); // return error if there isn't a token
    try {
      const res = await axios.post("/stats/get-number-of-customers", {
        Date1,
        Date2,
        isMember,
      });
      if (isMember) {
        dispatch({ type: TOTAL_NUMBER_OF_MEMBERS, payload: res.data.data });
      } else if (isMember === false) {
        dispatch({ type: TOTAL_NUMBER_OF_NON_MEMBERS, payload: res.data.data });
      } else if (isMember === null) {
        dispatch({ type: TOTAL_NUMBER_OF_CUSTOMER, payload: res.data.data });
      }
    } catch ({ response }) {
      SetAlert(response.data.message, response.data.type);
    }
  };

  const GetInfo = async () => {
    if (localStorage.ManagerToken)
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    else return SetAlert("No Permission");
    try {
      const res = await axios.get("/info/manager");
      dispatch({ type: SET_INFO, payload: res.data.data });
    } catch ({ response }) {
      return SetAlert(response.data.message, response.data.type);
    }
  };

  const PutInfo = async (update) => {
    if (localStorage.ManagerToken)
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
    else return SetAlert("No Permission");
    try {
      const res = await axios.put("/info/manager", { update });
      SetAlert(res.data.message, res.data.type);
    } catch ({ response }) {
      return SetAlert(response.data.message, response.data.type);
    }
  };
  return (
    <FacilitiesContext.Provider
      value={{
        Studio: state.Studio,
        Pool: state.Pool,
        FitnessRoom: state.FitnessRoom,
        ClimbingWall: state.ClimbingWall,
        SquashCourt1: state.SquashCourt1,
        SquashCourt2: state.SquashCourt2,
        SportsHall: state.SportsHall,

        TotalBookedSessions: state.TotalBookedSessions,
        FacilityActivityStats: state.FacilityActivityStats,
        TotalProfit: state.TotalProfit,
        TotalProfitPerFacility: state.TotalProfitPerFacility,
        TotalProfitPerActivity: state.TotalProfitPerActivity,
        TotalProfitFacilityPerActivity: state.TotalProfitFacilityPerActivity,
        Info: state.Info,

        TotalNumberOfCustomers: state.TotalNumberOfCustomers,
        TotalNumberOfMembers: state.TotalNumberOfMembers,
        TotalNumberOfNonMembers: state.TotalNumberOfNonMembers,
        TotalProfitAllFacilities: state.TotalProfitAllFacilities,
        TotalProfitAllActivities: state.TotalProfitAllActivities,
        AllFacilities: state.AllFacilities,

        GetFacility,
        PutFacility,
        GetBookedSessions,
        GetFacilityActivity,
        TotalProfitMade,
        TotalProfitMadeAllFacilities,
        TotalProfitMadeAllActivities,
        TotalProfitMadePerFacility,
        TotalProfitMadePerActivity,
        TotalProfitPerFacilityPerActivity,
        GetNumberOfCustomers,
        GetAllFacilities,
        GetInfo,
        PutInfo,
      }}
    >
      {props.children}
    </FacilitiesContext.Provider>
  );
};
