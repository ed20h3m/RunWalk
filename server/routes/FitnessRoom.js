// This is where the Climbing wall attributes are modified

// Import required packages

const express = require("express");
const FitnessRoomRouter = express.Router();
FitnessRoomRouter.use(express.json());
require("dotenv").config();
const FitnessRoom = require("../Models/FitnessRoom");
const { SessionSchema } = require("../Schemas/FacilitySchema");
const ManagerAuthentication = require("../Middleware/ManagerAuthentication");
const CustomerAuthentication = require("../Middleware/CustomerAuthentication");
const EmployeeAuthentication = require("../Middleware/EmployeeAuthentication");

// GET: used to get studio activities: AUTHENTICATION: YES
const FitnessRoomSessions = async (req, res) => {
  try {
    // Retrieve the fitness room object and all of its sessions
    const FitnessRoomSessions = await FitnessRoom.findById(
      process.env.FitnessRoom_ID
    ).select("Activities");
    if (!FitnessRoomSessions)
      return res.status(404).json({ message: "Not Found", type: "error" });
    // Respond With data
    res
      .status(200)
      .json({ data: FitnessRoomSessions.Activities, type: "success" });
  } catch (error) {
    // Respond with error message
    res.status(500).json({ data: error.message, type: "error" });
  }
};

// AUTHENTICATION REQUIRED: PUT function used to modify the studio
FitnessRoomRouter.put("/", ManagerAuthentication, async (req, res) => {
  //  Destruct the update object from the request body
  const { update } = req.body;
  // Check if there is a syntax error
  const { error } = SessionSchema.validate(update);
  // Respond if there is an error
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });
  try {
    //Update the Fitness room attributes/
    const fitnessRoom = await FitnessRoom.findByIdAndUpdate(
      process.env.FitnessRoom_ID,
      update
    );
    if (!fitnessRoom)
      return res
        .status(400)
        .json({ message: "Fitness Room wasn't updated ", type: "error" });
    // Responded to the user
    res.status(200).json({ message: "Fitness Room updated", type: "success" });
  } catch (error) {
    // Return if there is an error
    res.status(500).json({ message: error.message, type: "error" });
  }
});

const GetFitnessRoom = async (req, res) => {
  try {
    //Update the Fitness room attributes/
    const fitnessRoom = await FitnessRoom.findById(process.env.FitnessRoom_ID);
    if (!fitnessRoom)
      return res
        .status(400)
        .json({ message: "Fitness Room wasn't updated ", type: "error" });
    // Responded to the user
    res.status(200).json({ data: fitnessRoom, type: "success" });
  } catch (error) {
    // Return if there is an error
    res.status(500).json({ message: error.message, type: "error" });
  }
};

FitnessRoomRouter.get("/", ManagerAuthentication, GetFitnessRoom);
FitnessRoomRouter.get("/customer", CustomerAuthentication, GetFitnessRoom);
FitnessRoomRouter.get("/employee", EmployeeAuthentication, GetFitnessRoom);
module.exports = { FitnessRoomRouter, FitnessRoomSessions };
