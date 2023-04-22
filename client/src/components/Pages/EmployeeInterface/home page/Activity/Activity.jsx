import React, { useContext } from "react";
import { useState } from "react";
import { AlertContext } from "../../../../../context/Alert/Alert";
import EditCard from "../Edit/EditCard";
import Loading from "../../../../utils/Loading";
import "./Activity.css";

const facilityArrayMap = {
  "studio": "Studio",
  "swimming pool": "Pool",
  "fitness room": "FitnessRoom",
  "sports hall": "SportsHall",
  "squash court1": "SquashCourt1",
  "squash court2": "SquashCourt2",
  "climbing wall": "ClimbingWall"
};

const getArrayNameFromFacility = (facility) => facilityArrayMap[facility];


const Activity = (props) /* Destructuring the props */ => {
  const {
    Activity,
    Duration,
    Date,
    Facility
  } = props;
  const [isEdit, setisEdit] = useState(false)
  const {isLoading} = useContext(AlertContext)
  
  return (
    isLoading ? (
      <Loading />
    ) : (
      !isEdit?
    <div className="activity-card">
      <h1>Facility: {Facility}</h1>
      <h1>Activity: {Activity}</h1>
      <h1>Duration: {Duration} mins</h1>
      <h1>Date: {Date.split(" ")[0]}</h1>
      <h1>Time: {Date.split(" ")[1]}</h1>
      <button className="edit-button" onClick={()=>{setisEdit(true)}}>Edit</button>
    </div>:
    <EditCard {...props} arrayName = {getArrayNameFromFacility(Facility)} setisEdit = {setisEdit}></EditCard>
  ));
};

export default Activity;
