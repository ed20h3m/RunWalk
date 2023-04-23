// This is where the Climbing wall attributes are modified

// Import required packages

const express = require("express");
const ClimbingWallRouter = express.Router();
ClimbingWallRouter.use(express.json());
require("dotenv").config();
const ClimbingWall = require("../Models/ClimbingWall");
const { SessionSchema } = require("../Schemas/FacilitySchema");
const ManagerAuthentication = require("../Middleware/ManagerAuthentication");
const EmployeeAuthentication = require("../Middleware/EmployeeAuthentication");
const CustomerAuthentication = require("../Middleware/CustomerAuthentication");

// AUTHENTICATION REQUIRED: PUT function used to modify the studio
const ClimbingWallSessions = async (req, res) => {
  try {
    // Retrieve the climbing wall object and all of its sessions
    const ClimbingWallSessions = await ClimbingWall.findById(
      process.env.ClimbingWall_ID
    ).select("Activities");
    if (!ClimbingWallSessions)
      return res.status(404).json({ message: "Not Found", type: "error" });
    // Respond With data
    res
      .status(200)
      .json({ data: ClimbingWallSessions.Activities, type: "success" });
  } catch (error) {
    // Respond with error message
    res.status(500).json({ data: error.message, type: "error" });
  }
};

ClimbingWallRouter.put("/", ManagerAuthentication, async (req, res) => {
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
    // Update the studio attributes
    await ClimbingWall.findByIdAndUpdate(process.env.ClimbingWall_ID, update);
    // Responded to the user
    res.status(200).json({ message: "Climbing Wall updated", type: "success" });
  } catch (error) {
    // Return if there is an error
    res.status(500).json({ message: error.message, type: "error" });
  }
});

const GetWall = async (req, res) => {
  try {
    // Update the studio attributes
    const wall = await ClimbingWall.findById(process.env.ClimbingWall_ID);
    // Responded to the user
    res.status(200).json({ data: wall, type: "success" });
  } catch (error) {
    // Return if there is an error
    res.status(500).json({ message: error.message, type: "error" });
  }
};

ClimbingWallRouter.get("/", ManagerAuthentication, GetWall);
ClimbingWallRouter.get("/employee", EmployeeAuthentication, GetWall);
ClimbingWallRouter.get("/customer", CustomerAuthentication, GetWall);

module.exports = { ClimbingWallRouter, ClimbingWallSessions };
