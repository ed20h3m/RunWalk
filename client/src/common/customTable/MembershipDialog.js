// import libraries and components
import React from "react";
import { Grid, CircularProgress } from "@mui/material";
import CustomDialog from "../components/CustomDialog";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
const MembershipDialog = (props) => {
  // objects destructuring: picking specific properties from the object
  const { open, setOpen, data, setData, title, storeData, alertLoadDate } =
    props;
  // change the values
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({ ...data, [name]: value });
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
              label={" Annual Price"}
              name="AnnualPrice"
              value={data?.AnnualPrice}
              onChange={handleChange}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <CustomInput
              label={"Monthly Price"}
              name="MonthlyPrice"
              value={data?.MonthlyPrice}
              onChange={handleChange}
            />
          </Grid>{" "}
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <CustomInput
              label={"Discount"}
              name="Discount"
              value={data?.Discount}
              onChange={handleChange}
            />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
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

export default MembershipDialog;