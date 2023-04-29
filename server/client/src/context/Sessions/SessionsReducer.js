import {
  SET_POOL_SESSIONS,
  SET_STUDIO_SESSIONS,
  SET_CLIMBING_SESSIONS,
  SET_SQUASH_COURT_1_SESSIONS,
  SET_SQUASH_COURT_2_SESSIONS,
  SET_SPORTS_HALL_SESSIONS,
  SET_FITNESS_ROOM_SESSIONS,
  SET_CAPACITIES,
  SET_BOOKED_SESSIONS,
  ADD_CART_ITEM,
  REMOVE_CART_ITEM,
  SET_CART,
  SET_IS_BOOK,
  SET_INFO,
  SET_BOOKED_TIME,
} from "../types";

const SessionReducer = (state, action) => {
  switch (action.type) {
    default:
      return { ...state };
    case SET_POOL_SESSIONS: {
      return {
        ...state,
        PoolSessions: action.payload,
      };
    }
    case SET_STUDIO_SESSIONS: {
      return {
        ...state,
        StudioSessions: action.payload,
      };
    }
    case SET_CLIMBING_SESSIONS: {
      return {
        ...state,
        ClimbingWallSessions: action.payload,
      };
    }
    case SET_SQUASH_COURT_1_SESSIONS: {
      return {
        ...state,
        SquashCourt1Sessions: action.payload,
      };
    }
    case SET_SQUASH_COURT_2_SESSIONS: {
      return {
        ...state,
        SquashCourt2Sessions: action.payload,
      };
    }
    case SET_SPORTS_HALL_SESSIONS: {
      return {
        ...state,
        SportsHallSessions: action.payload,
      };
    }
    case SET_FITNESS_ROOM_SESSIONS: {
      return {
        ...state,
        FitnessRoomSessions: action.payload,
      };
    }
    case SET_CAPACITIES: {
      return {
        ...state,
        Capacities: action.payload,
      };
    }
    case SET_BOOKED_SESSIONS: {
      return {
        ...state,
        BookedSessions: action.payload,
      };
    }
    case SET_CART: {
      return {
        ...state,
        Cart: action.payload,
      };
    }
    case ADD_CART_ITEM: {
      return {
        ...state,
        Cart: action.payload,
      };
    }
    case REMOVE_CART_ITEM: {
      return {
        ...state,
        Cart: action.payload,
      };
    }
    case SET_IS_BOOK: {
      return {
        ...state,
        isBook: action.payload,
      };
    }
    case SET_INFO: {
      return {
        ...state,
        info: action.payload,
      };
    }
    case SET_BOOKED_TIME: {
      return {
        ...state,
        BookedTime: action.payload,
      };
    }
  }
};
export default SessionReducer;
