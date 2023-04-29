import {
  SET_POOL,
  SET_STUDIO,
  SET_FITNESS_ROOM,
  SET_SPORTS_HALL,
  SET_SQUASH_COURT_1,
  SET_SQUASH_COURT_2,
  SET_CLIMBING_WALL,
  SET_BOOKED_SESSIONS_STATS,
  SET_FACILITY_ACTIVITY_STATS,
  SET_TOTAL_PROFIT,
  SET_TOTAL_PROFIT_FACILITY,
  SET_TOTAL_PROFIT_ACTIVITY,
  SET_TOTAL_PROFIT_PER_FACILITY_PER_ACTIVITY,
  SET_INFO,
  TOTAL_NUMBER_OF_CUSTOMER,
  TOTAL_NUMBER_OF_MEMBERS,
  TOTAL_NUMBER_OF_NON_MEMBERS,
  SET_TOTAL_PROFIT_All_FACILITIES,
  SET_TOTAL_PROFIT_All_ACTIVITIES,
  SET_ALL_FACILITIES,
} from "../types";
const FacilitiesReducer = (state, action) => {
  switch (action.type) {
    default:
      return { ...state };
    case SET_POOL: {
      return {
        ...state,
        Pool: action.payload,
      };
    }
    case SET_STUDIO: {
      return {
        ...state,
        Studio: action.payload,
      };
    }
    case SET_FITNESS_ROOM: {
      return {
        ...state,
        FitnessRoom: action.payload,
      };
    }
    case SET_SPORTS_HALL: {
      return {
        ...state,
        SportsHall: action.payload,
      };
    }
    case SET_SQUASH_COURT_1: {
      return {
        ...state,
        SquashCourt1: action.payload,
      };
    }
    case SET_SQUASH_COURT_2: {
      return {
        ...state,
        SquashCourt2: action.payload,
      };
    }
    case SET_CLIMBING_WALL: {
      return {
        ...state,
        ClimbingWall: action.payload,
      };
    }
    case SET_BOOKED_SESSIONS_STATS: {
      return {
        ...state,
        TotalBookedSessions: action.payload,
      };
    }
    case SET_FACILITY_ACTIVITY_STATS: {
      return {
        ...state,
        FacilityActivityStats: action.payload,
      };
    }
    case SET_TOTAL_PROFIT: {
      return {
        ...state,
        TotalProfit: action.payload,
      };
    }
    case SET_TOTAL_PROFIT_FACILITY: {
      return {
        ...state,
        TotalProfitPerFacility: action.payload,
      };
    }
    case SET_TOTAL_PROFIT_All_FACILITIES: {
      return {
        ...state,
        TotalProfitAllFacilities: action.payload,
      };
    }
    case SET_TOTAL_PROFIT_All_ACTIVITIES: {
      return {
        ...state,
        TotalProfitAllActivities: action.payload,
      };
    }
    case SET_TOTAL_PROFIT_ACTIVITY: {
      return {
        ...state,
        TotalProfitPerActivity: action.payload,
      };
    }
    case SET_TOTAL_PROFIT_PER_FACILITY_PER_ACTIVITY: {
      return {
        ...state,
        TotalProfitFacilityPerActivity: action.payload,
      };
    }
    case TOTAL_NUMBER_OF_CUSTOMER: {
      return {
        ...state,
        TotalNumberOfCustomers: action.payload,
      };
    }
    case TOTAL_NUMBER_OF_MEMBERS: {
      return {
        ...state,
        TotalNumberOfMembers: action.payload,
      };
    }
    case TOTAL_NUMBER_OF_NON_MEMBERS: {
      return {
        ...state,
        TotalNumberOfNonMembers: action.payload,
      };
    }
    case SET_INFO: {
      return {
        ...state,
        Info: action.payload,
      };
    }
    case SET_ALL_FACILITIES: {
      return {
        ...state,
        AllFacilities: action.payload,
      };
    }
  }
};
export default FacilitiesReducer;
