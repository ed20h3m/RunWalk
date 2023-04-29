import React, { useState, Fragment, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap/";
import { useNavigate } from "react-router-dom";
import Footer from "../../utils/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "../../utils/Loading";
import { AlertContext } from "../../../context/Alert/Alert";
import { AuthContext } from "../../../context/Authentication/AuthState";
import "./Page.css";

const SignUp = () => {
  //use state
  const { isLoading } = useContext(AlertContext);
  const { CustomerSignUp } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [state, setState] = useState({});

  // nevigate component
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    await CustomerSignUp(state);
    e.preventDefault();
  };
  //password strength
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setState({ ...state, [e.target.name]: e.target.value });

    if (value.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }
    if (!value.match(/[A-Z]/)) {
      setErrorMessage("Password must contain at least one uppercase letter");
      return;
    }
    if (!value.match(/[a-z]/)) {
      setErrorMessage("Password must contain at least one lowercase letter");
      return;
    }
    if (!value.match(/[0-9]/)) {
      setErrorMessage("Password must contain at least one number");
      return;
    }
    if (!value.match(/[!@#$%^&*]/)) {
      setErrorMessage("Password must contain at least one special character");
      return;
    }
    setErrorMessage("");
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setState({ ...state, [e.target.name]: e.target.value });
    const re = /\S+@\S+\.\S+/;
    if (!re.test(newEmail)) {
      setValidEmail("  Please enter a valid email address");
    } else {
      setValidEmail("");
    }
  };
  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
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
                    <label>First Name</label>
                    <input
                      type="text"
                      name="FirstName"
                      className="form-control mt-1"
                      placeholder="Enter Full Name"
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="LastName"
                      className="form-control mt-1"
                      placeholder="Enter Last Name"
                      onChange={onChange}
                    />
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
                      Sign up
                    </button>
                  </div>

                  <p className="forgot-password text-right mt-2">
                    Have an account? <a href="/">Login</a>
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

export default SignUp;
