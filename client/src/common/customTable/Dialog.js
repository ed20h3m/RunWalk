// import libraries and components
import React, { useState } from "react";
import { Grid, CircularProgress } from "@mui/material";
import CustomDialog from "../components/CustomDialog";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
const Dialog = (props) => {
  // objects destructuring: picking specific properties from the object
  const {
    open,
    setOpen,
    data,
    setData,
    title,
    storeData,
    alertLoadDate,
    status,
  } = props;
  // usestate to declare the values
  const [errorMessage, setErrorMessage] = useState("");
  // changes the values
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({ ...data, [name]: value });
  };

  //password strength
  const handlePasswordChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
    const value = event.target.value;

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
    if (!value.match(/[!@#$%^&*-_()£+={}<>.,/]/)) {
      setErrorMessage("Password must contain at least one special character");
      return;
    }
    setErrorMessage("");
  };

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title={title}
      maxWidth="sm"
      content={
        <Grid container spacing={2}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <CustomInput
              label={"First Name"}
              name="FirstName"
              value={data?.FirstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <CustomInput
              label={"Last Name"}
              name="LastName"
              value={data?.LastName}
              onChange={handleChange}
            />
          </Grid>{" "}
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <CustomInput
              label={"Email"}
              name="Email"
              value={data?.Email}
              onChange={handleChange}
            />
          </Grid>
          {status != "edit" && (
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <CustomInput
                label={"Password"}
                value={data?.Password}
                type="password"
                name="Password"
                onChange={handlePasswordChange}
              />
              {errorMessage && (
                <div style={{ color: "red" }}>{errorMessage}</div>
              )}
            </Grid>
          )}
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <div
              className="app-flex-location"
              style={{ justifyContent: "end", display: "flex" }}
            >
              <div className="app-item">
                {alertLoadDate ? (
                  <div className="loader">
                    <CircularProgress size={20} />
                  </div>
                ) : (
                  <CustomButton
                    onClick={storeData}
                    text={"Save"}
                    marginLeft={"10px"}
                  />
                )}
              </div>
            </div>
          </Grid>
        </Grid>
      }
    />
  );
};

export default Dialog;