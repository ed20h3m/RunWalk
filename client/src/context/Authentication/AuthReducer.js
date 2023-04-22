import {
  SET_CUSTOMER_ID,
  SET_CUSTOMER,
  SET_MANAGER,
  SET_MANAGER_ID,
  SET_EMPLOYEES,
  SET_EMPLOYEE,
  SET_EMPLOYEE_ID,
} from ".././types";
const AuthReducer = (state, action) => {
  switch (action.type) {
    default:
      return { ...state };
    case SET_CUSTOMER_ID: {
      return {
        ...state,
        customerId: action.payload,
      };
    }
    case SET_CUSTOMER: {
      return {
        ...state,
        customer: action.payload,
      };
    }
    case SET_MANAGER_ID: {
      return {
        ...state,
        ManagerId: action.payload,
      };
    }
    case SET_MANAGER: {
      return {
        ...state,
        Manager: action.payload,
      };
    }
    case SET_EMPLOYEES: {
      return {
        ...state,
        Employees: action.payload,
      };
    }
    case SET_EMPLOYEE: {
      return {
        ...state,
        Employee: action.payload,
      };
    }
    case SET_EMPLOYEE_ID: {
      return {
        ...state,
        EmployeeId: action.payload,
      };
    }
  }
};
export default AuthReducer;
