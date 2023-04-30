import React, { useContext } from "react";
import { useState } from "react";
import { AlertContext } from "../../../../../context/Alert/Alert";
import EditCard from "../Edit/EditCard";
import Loading from "../../../../utils/Loading";
import { Grid } from "@mui/material";
import "./Activity.css";

const facilityArrayMap = {
  studio: "Studio",
  "swimming pool": "Pool",
  "fitness room": "FitnessRoom",
  "sports hall": "SportsHall",
  "squash court1": "SquashCourt1",
  "squash court2": "SquashCourt2",
  "climbing wall": "ClimbingWall",
};

const getArrayNameFromFacility = (facility) => facilityArrayMap[facility];

const Activity = (props) /* Destructuring the props */ => {
  const { Activity, Duration, Date, Facility } = props;
  const [isEdit, setisEdit] = useState(false);
  const { isLoading } = useContext(AlertContext);

  return isLoading ? (
    <Loading />
  ) : !isEdit ? (
    <div className="activity-card">
      <Grid container spacing={2} style={{ textAlign: "left" }}>
        {" "}
        <Grid item xs={12} sm={6} md={6} className="align-left">
          <h1>Facility </h1>{" "}
        </Grid>{" "}
        <Grid item xs={12} sm={6} md={6} className="align-left">
          <h1> {Facility}</h1>
        </Grid>
        <Grid item xs={12} sm={6} md={6} className="align-top">
          <h1>Activity </h1>{" "}
        </Grid>{" "}
        <Grid item xs={12} sm={6} md={6} className="align-top">
          <h1>{Activity}</h1>{" "}
        </Grid>
        <Grid item xs={12} sm={6} md={6} className="align-top">
          <h1>Duration </h1>{" "}
        </Grid>{" "}
        <Grid item xs={12} sm={6} md={6} className="align-top">
          <h1>{Duration} mins</h1>{" "}
        </Grid>
        <Grid item xs={12} sm={6} md={6} className="align-top">
          <h1>Date</h1>{" "}
        </Grid>{" "}
        <Grid item xs={12} sm={6} md={6} className="align-top">
          <h1> {Date.split(" ")[0]}</h1>{" "}
        </Grid>
        <Grid item xs={12} sm={6} md={6} className="align-top">
          <h1>Time</h1>{" "}
        </Grid>{" "}
        <Grid item xs={12} sm={6} md={6} className="align-top">
          <h1> {Date.split(" ")[1]}</h1>{" "}
        </Grid>{" "}
      </Grid>
      <button
        className="edit-button"
        style={{ width: "66%" }}
        onClick={() => {
          setisEdit(true);
        }}
      >
        Edit
      </button>
    </div>
  ) : (
    <EditCard
      {...props}
      arrayName={getArrayNameFromFacility(Facility)}
      setisEdit={setisEdit}
    ></EditCard>
  );
};

export default Activity;