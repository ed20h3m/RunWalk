import React, { useState, useContext, Fragment } from "react";
import { Container, Row } from "react-bootstrap/";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/Authentication/AuthState";
import { AlertContext } from "../../../context/Alert/Alert";
import Loading from "../../utils/Loading";
import Footer from "../../utils/Footer";
//Bootstrap Library
import "bootstrap/dist/css/bootstrap.min.css";
//import styles
import "./Page.css";

const Login = () => {
  const { CustomerLogin, EmployeeLogin, ManagerLogin } =
    useContext(AuthContext);
  const { isLoading } = useContext(AlertContext);
  const [state, setState] = useState({
    Email: "",
    Password: "",
  });

  //use state
  const [errorMessage, setErrorMessage] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validEmailSyntax, setValidEmailSyntax] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const [isCustomer, setCustomer] = useState(true);
  const [isEmployee, setEmployee] = useState(false);
  const [isManager, setManager] = useState(false);
  const onCheck = (e) => {
    if (e.target.name === "isCustomer") {
      setCustomer((isCustomer) => !isCustomer);
      setEmployee((isEmployee) => false);
      setManager((isManager) => false);
    } else if (e.target.name === "isEmployee") {
      setEmployee((isEmployee) => !isEmployee);
      setCustomer((isCustomer) => false);
      setManager((isManager) => false);
    } else if (e.target.name === "isManager") {
      setManager((isManager) => !isManager);
      setEmployee((isEmployee) => false);
      setCustomer((isCustomer) => false);
    }
  };
  const handleSubmit = (e) => {
    if (
      validEmailSyntax &&
      validPassword &&
      (isManager || isEmployee || isCustomer)
    ) {
      if (isCustomer) CustomerLogin(state);
      else if (isEmployee) EmployeeLogin(state);
      else if (isManager) ManagerLogin(state);
    }
    e.preventDefault();
  };

  //password strength
  const handlePasswordChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
    const value = event.target.value;

    if (value.length < 8) {
      setValidPassword(false);
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }
    if (!value.match(/[A-Z]/)) {
      setValidPassword(false);
      setErrorMessage("Password must contain at least one uppercase letter");
      return;
    }
    if (!value.match(/[a-z]/)) {
      setValidPassword(false);
      setErrorMessage("Password must contain at least one lowercase letter");
      return;
    }
    if (!value.match(/[0-9]/)) {
      setValidPassword(false);
      setErrorMessage("Password must contain at least one number");
      return;
    }
    if (!value.match(/[!@#$%^&*-_()£+={}<>.,/]/)) {
      setValidPassword(false);
      setErrorMessage("Password must contain at least one special character");
      return;
    }
    setErrorMessage("");
    setValidPassword(true);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setState({ ...state, [e.target.name]: e.target.value });

    const re = /\S+@\S+\.\S+/;
    if (!re.test(newEmail)) {
      setValidEmailSyntax(false);
      setValidEmail("  Please enter a valid email address");
    } else {
      setValidEmail("");
      setValidEmailSyntax(true);
    }
  };
  return isLoading ? (
    <Loading />
  ) : (
    <Fragment>
      <div className="page-login login-container">
        <Container>
          <Row>
            <div className="Auth-form-container">
              <form className="Auth-form">
                <div className="Auth-form-content ">
                  <div className="form-group mt-3">
                    <label>Email address</label>
                    <input
                      type="email"
                      name="Email"
                      className="form-control mt-1"
                      placeholder="Enter email"
                      onChange={handleEmailChange}
                    />
                    {validEmail && (
                      <div style={{ color: "red" }}>{validEmail}</div>
                    )}
                  </div>
                  <div className="form-group mt-3">
                    <label>Password</label>
                    <input
                      type="password"
                      name="Password"
                      className="form-control mt-1"
                      placeholder="Enter password"
                      onChange={handlePasswordChange}
                    />
                    <div className="check-boxes">
                      <div>
                        <input
                          type="checkbox"
                          name="isCustomer"
                          checked={isCustomer}
                          onChange={onCheck}
                        />
                        <label>Customer</label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="isEmployee"
                          checked={isEmployee}
                          onChange={onCheck}
                        />
                        <label>Employee</label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="isManager"
                          checked={isManager}
                          onChange={onCheck}
                        />
                        <label>Manager</label>
                      </div>
                    </div>
                    {errorMessage && (
                      <div style={{ color: "red" }}>{errorMessage}</div>
                    )}
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="submitbtn btn-dark"
                    >
                      Sign in
                    </button>
                  </div>
                  <p className="forgot-password text-right mt-2">
                    Forgot <a href="/forgotten-password">Password?</a>
                  </p>
                  <p className="forgot-password text-right mt-2">
                    Don't have an account? <a href="/signup">Sign Up</a>
                  </p>
                </div>
              </form>
            </div>
          </Row>
        </Container>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Login;
