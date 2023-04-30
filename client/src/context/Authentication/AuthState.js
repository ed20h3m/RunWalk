// Import all packages required
import { createContext, useReducer, useContext } from "react";
import AuthReducer from "./AuthReducer";
import bcrypt from "bcryptjs";
import jwt_decode from "jwt-decode";
import axios from "axios";
import {
  SET_CUSTOMER_ID,
  SET_CUSTOMER,
  SET_MANAGER,
  SET_MANAGER_ID,
  SET_EMPLOYEE,
  SET_EMPLOYEES,
  SET_EMPLOYEE_ID,
} from "../types";
import {
  CustomerSchemaLogin,
  CustomerSchema,
  CustomerSchemaPut,
  CustomerSchemaPassword,
} from "../Schemas/CustomerSchema";
import {
  EmployeeSchemaLogin,
  EmployeeSchema,
  EmployeeSchemaPut,
} from "../Schemas/EmployeeSchema";
import {
  ManagerSchemaLogin,
  ManagerSchemaPut,
  ManagerSchemaPassword,
} from "../Schemas/ManagerSchema";
import { PasswordSchema, EmailSchema } from "../Schemas/AttSchema";

import { AlertContext } from "../Alert/Alert";
export const AuthContext = createContext();

export const AuthState = (props) => {
  // Set initial state
  const initialState = {
    customerId: null,
    customer: null,
    Employee: null,
    EmployeeId: null,
    Manager: null,
    ManagerId: null,
    Employees: [],
  };

  // create a reducer and a state
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const { SetAlert, ToggleLoading } = useContext(AlertContext);

  // ############# MANAGER ################

  // Manager Login
  const ManagerLogin = async (state) => {
    const { Email, Password } = state;
    // Email = "sports.centre.2023@gmail.com";
    // Password = "12345678";
    // Check for syntax error
    const { error } = ManagerSchemaLogin.validate({ Email, Password });
    // If error return message
    if (error)
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    try {
      // Make a request to the back end
      ToggleLoading(true);
      const res = await axios.post("/manager/login", { Email, Password });
      ToggleLoading(false);
      // Check if there is token and store it in local storage
      if (res.data.Token) localStorage.setItem("ManagerToken", res.data.Token);
      SetAlert("Logged In Successfully", res.data.type);
      // Decode token
      const token = jwt_decode(res.data.Token);
      localStorage.setItem("ManagerId", token.id);
      // set manager id
      SetManagerId();
      window.location.href = "/manager/dashboard";
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
    ToggleLoading(false);
  };
  // Manager Put
  const PutManager = async (update = null) => {
    update = {
      _id: localStorage.ManagerId,
      Email: "sports.centre.2023@gmail.com",
      FirstName: "sports",
    };
    // check for a syntax error
    const { error } = ManagerSchemaPut.validate(update);
    // If there is an error alert
    if (error)
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    try {
      // Check if there is a header
      if (!localStorage.ManagerToken) return SetAlert("Not Authenticated");
      // Set token to header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
      // make a request to amend manager profile
      const res = await axios.put("/manager", { update });
      SetAlert(res.data.message, res.data.type);
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // Manager Change Password
  const ManagerChangePassword = async (manager) => {
    manager = {
      _id: localStorage.ManagerId,
      Password: "123456789",
    };
    const { error } = ManagerSchemaPassword.validate(manager);
    if (error)
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    try {
      // Check if there is a header
      if (!localStorage.ManagerToken) return SetAlert("Not Authenticated");
      // Set token to header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
      // Make request to back end
      const res = await axios.put("/manager", { manager });
      SetAlert(res.data.message, res.data.type);
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // store manager id in the state
  const SetManagerId = () => {
    // store customer id in state
    if (localStorage.ManagerId)
      dispatch({ type: SET_MANAGER_ID, payload: localStorage.ManagerId });
  };
  // Get manager object
  const GetManager = async () => {
    // Check if the customer is logged in
    if (!(state.ManagerId || localStorage.ManagerToken))
      return SetAlert("Authentication required");
    try {
      // Set token header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
      // Make a get request to get the customer object
      const res = await axios.get("/manager");
      // store object in state
      dispatch({ type: SET_MANAGER, payload: res.data.data });
      SetManagerId();
    } catch ({ response }) {
      // Alert if error
      SetAlert(response.data.message, response.data.type);
    }
  };

  // ############# CUSTOMER ################

  // Customer login: Receives a customer object which contains Email and password
  const CustomerLogin = async (customer = null) => {
    // customer = {
    //   Email: "hm.mousavi.02@gmail.com",
    //   Password: "12345678",
    // };
    // Check if there is an error
    const { error } = CustomerSchemaLogin.validate(customer);
    if (error) {
      // Alert of there is an error
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    }
    try {
      // call server request
      ToggleLoading(true);
      const res = await axios.post("/customer/login", customer);

      // store token in local storage
      localStorage.setItem("CustomerToken", res.data.Token);
      // decode token
      const token = jwt_decode(res.data.Token);
      // Add id to local storage
      localStorage.setItem("CustomerId", token.id);
      SetCustomerId();

      SetAlert("Logged in", res.data.type);
      window.location.href = "/customer/home";
    } catch ({ response }) {
      // output error
      SetAlert(response.data.message);
    }
    ToggleLoading(false);
  };
  // Set customer id
  const SetCustomerId = () => {
    // store customer id in state
    if (localStorage.CustomerId)
      dispatch({ type: SET_CUSTOMER_ID, payload: localStorage.CustomerId });
  };
  // Customer Sign up: Receives a customer object
  const CustomerSignUp = async (customer = null) => {
    // Add is member attribute
    customer.isMember = false;
    customer.subId = ".";
    const { error } = CustomerSchema.validate(customer);
    // Check for syntax errors
    if (error) {
      // Alert of there is an error
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    }
    try {
      // call server request
      ToggleLoading(true);
      const res = await axios.post("/customers", customer);
      ToggleLoading(false);
      // Show message
      if (res.data.type === "success") window.location.href = "/login";
      SetAlert(res.data.message, res.data.type);
      // => Push to a different page
    } catch ({ response }) {
      // output error
      SetAlert(response.data.message, response.data.type);
    }
    ToggleLoading(false);
  };
  // Get Customer object
  const GetCustomer = async () => {
    // Check if the customer is logged in
    if (!(state.customerId || localStorage.CustomerToken))
      return SetAlert("Authentication required");
    try {
      // Set token header
      if (localStorage.CustomerToken) {
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      } else return;
      ToggleLoading(true);
      // Make a get request to get the customer object
      const res = await axios.get("/customers");
      ToggleLoading(false);
      // store object in state
      dispatch({ type: SET_CUSTOMER, payload: res.data.data });
    } catch ({ response }) {
      // Alert if error
      SetAlert(response.data.message);
    }
  };
  // Amend Customer
  const PutCustomer = async (update) => {
    if (!localStorage.EmployeeToken) {
      if (!(localStorage.CustomerToken || localStorage.CustomerId))
        return SetAlert("Not Authenticated");
    }
    if (localStorage.CustomerToken) {
      update._id = localStorage.CustomerId;
      delete update.NewPassword;
      delete update.Password;
    }
    // Check for syntax error
    const { error } = CustomerSchemaPut.validate(update);
    // if Error output an alert
    if (error)
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    try {
      let path;
      // Set token header
      if (localStorage.CustomerToken) {
        path = "/customers";
        axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      } else if (localStorage.EmployeeToken) {
        path = "employee/edit-customer";
        axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      }
      // make a request if the syntax is validated
      ToggleLoading(true);

      const res = await axios.put(path, { update });
      // Output success message
      SetAlert(res.data.message, res.data.type);
    } catch ({ response }) {
      // if error alert customer
      SetAlert(response.data.message, response.data.type);
    }
    ToggleLoading(false);
  };
  // Customer password Change
  const CustomerChangePassword = async (update) => {
    const isCorrect = await bcrypt.compare(
      update.Password,
      state.customer.Password
    );
    if (!isCorrect) {
      SetAlert("Current Password is Incorrect", "error");
      return false;
    }
    update.Password = update.NewPassword;
    delete update.NewPassword;
    update._id = localStorage.CustomerId;
    const { error } = CustomerSchemaPassword.validate(update);
    // if Error output an alert
    if (error)
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    try {
      // Set token header
      axios.defaults.headers.common["token"] = localStorage.CustomerToken;
      // make a request if the syntax is validated
      ToggleLoading(true);
      const res = await axios.put("/customers/change-password", {
        customer: update,
      });
      ToggleLoading(false);
      // Output success message
      SetAlert(res.data.message, res.data.type);
      return true;
    } catch ({ response }) {
      // if error alert customer
      SetAlert(response.data.message);
      return false;
    }
  };

  // ############# EMPLOYEE ################

  // Employee Login
  const EmployeeLogin = async (EmployeeObj) => {
    const { error } = EmployeeSchemaLogin.validate(EmployeeObj);
    // if Error output an alert
    if (error)
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    try {
      // make a request if the syntax is validated
      ToggleLoading(true);
      const res = await axios.post("/employee/login", { EmployeeObj });
      ToggleLoading(false);
      // store token in local storage
      localStorage.setItem("EmployeeToken", res.data.Token);
      const token = jwt_decode(res.data.Token);
      // Add id to local storage
      localStorage.setItem("EmployeeId", token.id);
      SetAlert("Logged in", res.data.type);
      window.location.href = "/employee/home";
      SetEmployeeId();
    } catch ({ response }) {
      // if error alert customer
      //
      SetAlert(response.data.message);
    }
    ToggleLoading(false);
  };
  // Set customer id
  const SetEmployeeId = () => {
    // store customer id in state
    if (localStorage.EmployeeId)
      dispatch({ type: SET_EMPLOYEE_ID, payload: localStorage.EmployeeId });
  };
  // Create Employee
  const CreateEmployee = async (employeeObj) => {
    // employeeObj = {
    //   FirstName: "Employee",
    //   LastName: "Hesam",
    //   Email: "d.3s@yahoo.com",
    //   Password: "12345678",
    //   isSuspended: false,
    // };
    employeeObj.isSuspended = false;
    // check for syntax error
    const { error } = EmployeeSchema.validate(employeeObj);
    // Alert error message
    if (error)
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    try {
      // Set manager token
      if (!localStorage.ManagerToken) return SetAlert("Not Authenticated");
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
      // call server request
      const res = await axios.post("/employee", { employeeObj });
      // Show message
      SetAlert(res.data.message, res.data.type);
      // => Push to a different page
    } catch ({ response }) {
      // output error
      SetAlert(response.data.message);
    }
  };
  // Get all employees
  const GetEmployees = async () => {
    // Check if the manager is logged in
    if (!localStorage.ManagerToken)
      // If no token: return error message
      return SetAlert("Not Authenticated");
    try {
      // Set token in header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
      // Make request to backend
      ToggleLoading(true);
      const res = await axios.get("/employee");
      // ToggleLoading(false);
      dispatch({ type: SET_EMPLOYEES, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
    ToggleLoading(false);
  };
  // Get one employee
  const GetOneEmployee = async (_id) => {
    // Check if the manager is logged in
    if (!localStorage.ManagerToken)
      // If no token: return error message
      return SetAlert("Not Authenticated");
    try {
      // Set token in header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
      axios.defaults.headers.common["_id"] = _id;
      // Make request to backend
      const res = await axios.get("/employee/find-one");
      dispatch({ type: SET_EMPLOYEE, payload: res.data.data });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // Amend an employee
  const PutEmployee = async (update = null) => {
    // Check if the manager is logged in
    if (!localStorage.ManagerToken)
      // If no token: return error message
      return SetAlert("Not Authenticated");
    update = {
      _id: update._id,
      isSuspended: update.isSuspended,
      Email: update.Email,
      FirstName: update.FirstName,
      LastName: update.LastName,
    };

    // update = {
    //   _id: "63ee9bacb1477872e853e1d5",
    //   isSuspended: true,
    // };
    // Check syntax of the update object
    const { error } = EmployeeSchemaPut.validate(update);
    // if error return alert
    if (error)
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");
    try {
      // Set token in header
      axios.defaults.headers.common["token"] = localStorage.ManagerToken;
      // Make request to backend
      const res = await axios.put("/employee", { update });
      SetAlert(res.data.message, res.data.type);
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // Get customer details for employee
  const GetCustomerDetails = async (Email) => {
    try {
      // Set token header
      if (localStorage.EmployeeToken) {
        axios.defaults.headers.common["token"] = localStorage.EmployeeToken;
      } else return;
      ToggleLoading(true);
      // Make a get request to get the customer object
      const res = await axios.post("/employee/get-customer", { Email });
      ToggleLoading(false);
      // store object in state
      dispatch({ type: SET_CUSTOMER, payload: res.data.data });
      if (res.data.message) {
        SetAlert(res.data.message);
      }
    } catch ({ response }) {
      console.log(response);
      // Alert if error
      if (response.data.message) {
        SetAlert(response.data.message);
      }
    }
    ToggleLoading(false);
  };
  // send reset password email
  const SendResetPasswordEmail = async (Email) => {
    const { error } = EmailSchema.validate({ Email });
    if (error)
      return SetAlert(error.details[0].message.replace(/"/g, ""), "error");

    ToggleLoading(true);
    const res = await axios.post("/reset-password", { Email });
    SetAlert(res.data.message, res.data.type);
    if (res.data.message !== "Updated Password") {
      window.location.href = "/";
    }
    ToggleLoading(false);
  };
  // check if change password link is valid
  const validateLink = async (id, token) => {
    ToggleLoading(true);
    const res = await axios.get(`/reset-password/${id}/${token}`);
    ToggleLoading(false);
    return res.data;
  };
  // change password
  const changePass = async (id, token, password, password2) => {
    if (password !== password2)
      return SetAlert("Passwords Don't Match", "error");
    const { error } = PasswordSchema.validate({ Password: password });
    if (error) return SetAlert(error.details[0].message, "error");
    ToggleLoading(true);
    const res = await axios.post(`/reset-password/${id}/${token}`, {
      Password: password,
    });
    ToggleLoading(false);
    SetAlert(res.data.message, res.data.type);
    if (res.data.message === "Password Updated") {
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
  };
  // Share state
  return (
    <AuthContext.Provider
      value={{
        customerId: state.customerId,
        customer: state.customer,
        Employee: state.Employee,
        EmployeeId: state.EmployeeId,
        Manager: state.Manager,
        ManagerId: state.ManagerId,
        Employees: state.Employees,

        ManagerLogin,
        PutManager,
        ManagerChangePassword,
        SetManagerId,
        GetManager,
        validateLink,
        changePass,
        SendResetPasswordEmail,

        CustomerLogin,
        CustomerSignUp,
        SetCustomerId,
        GetCustomer,
        PutCustomer,
        CustomerChangePassword,

        EmployeeLogin,
        SetEmployeeId,
        CreateEmployee,
        GetEmployees,
        GetOneEmployee,
        PutEmployee,
        GetCustomerDetails,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
