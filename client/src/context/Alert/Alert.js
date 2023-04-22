// Import all packages required
import { createContext, useReducer } from "react";
import {
  SET_ALERT,
  REMOVE_ALERT,
  TOGGLE_LOADING,
  TOGGLE_OVERLAY,
  TOGGLE_BASKET,
  TOGGLE_BOOK_FORM,
  TOGGLE_LOADING_FORM,
  TOGGLE_MENU,
} from "../types";
import { v4 as uuid } from "uuid";
export const AlertContext = createContext();

const AlertReducer = (state, action) => {
  switch (action.type) {
    default:
      return { ...state };
    case SET_ALERT: {
      const doesExists = state.Alerts.filter(
        (item) => item.message === action.payload.message
      );
      if (doesExists.length > 0) {
        return {
          ...state,
        };
      } else {
        return {
          ...state,
          Alerts: [...state.Alerts, action.payload],
        };
      }
    }
    case TOGGLE_LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case TOGGLE_OVERLAY: {
      return {
        ...state,
        showOverlay: action.payload,
      };
    }
    case TOGGLE_BASKET: {
      return {
        ...state,
        showBasket: action.payload,
      };
    }
    case TOGGLE_MENU: {
      return {
        ...state,
        Menu: action.payload,
      };
    }
    case REMOVE_ALERT: {
      return {
        ...state,
        Alerts: state.Alerts.filter((element) => element.id !== action.payload),
      };
    }
    case TOGGLE_BOOK_FORM: {
      return {
        ...state,
        showBookForm: !state.showBookForm,
      };
    }
    case TOGGLE_LOADING_FORM: {
      return {
        ...state,
        isLoadingForm: !state.isLoadingForm,
      };
    }
  }
};

export const AlertState = (props) => {
  // Set initial state
  const initialState = {
    Alerts: [],
    isLoading: false,
    isLoadingForm: false,
    showOverlay: false,
    showBasket: false,
    showBookForm: false,
    Menu: false,
  };

  // create a reducer and a state
  const [state, dispatch] = useReducer(AlertReducer, initialState);

  const SetAlert = (message, type = "warning") => {
    const id = uuid();
    dispatch({ type: SET_ALERT, payload: { message, type, id } });
    setTimeout(() => RemoveAlert(id), 3000);
  };
  const RemoveAlert = (id) => {
    dispatch({
      type: REMOVE_ALERT,
      payload: id,
    });
  };
  const ToggleLoading = (load) => {
    dispatch({
      type: TOGGLE_LOADING,
      payload: load,
    });
  };
  const ToggleLoadingForm = (load) => {
    dispatch({
      type: TOGGLE_LOADING_FORM,
      payload: load,
    });
  };
  const ToggleOverlay = (option) => {
    const body = document.getElementsByTagName("body")[0];
    body.style.overflow = option ? "hidden" : "auto";
    dispatch({
      type: TOGGLE_OVERLAY,
      payload: option,
    });
  };
  const ToggleBookForm = (show) => {
    dispatch({
      type: TOGGLE_BOOK_FORM,
      payload: show,
    });
  };
  const ToggleBasket = (show) => {
    const basket = document.getElementsByClassName("basket")[0];
    basket.style.right = show ? "0px" : "-320px";
    dispatch({
      type: TOGGLE_BASKET,
      payload: show,
    });
  };
  const ToggleMenu = (show) => {
    const menu = document.getElementsByClassName("side-menuuu")[0];
    menu.style.right = show ? "10px" : "-150px";
    // console.log(menu.style);
    dispatch({
      type: TOGGLE_MENU,
      payload: show,
    });
  };
  return (
    <AlertContext.Provider
      value={{
        SetAlert,
        RemoveAlert,
        ToggleLoading,
        ToggleOverlay,
        ToggleBasket,
        ToggleBookForm,
        ToggleLoadingForm,
        ToggleMenu,
        Alerts: state.Alerts,
        isLoading: state.isLoading,
        showOverlay: state.showOverlay,
        showBasket: state.showBasket,
        showBookForm: state.showBookForm,
        isLoadingForm: state.isLoadingForm,
        Menu: state.Menu,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};
