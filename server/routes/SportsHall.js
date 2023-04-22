// This is where the SquashCourt1 attributes are modified

// Import required packages

const express = require("express");
const SportsHallRouter = express.Router();
SportsHallRouter.use(express.json());
require("dotenv").config();
const SportsHall = require("../Models/SportsHall");
const { SessionSchema } = require("../Schemas/FacilitySchema");
const ManagerAuthentication = require("../Middleware/ManagerAuthentication");
const CustomerAuthentication = require("../Middleware/CustomerAuthentication");
const EmployeeAuthentication = require("../Middleware/EmployeeAuthentication");

const SportsHallSessions = async (req, res) => {
  try {
    // Retrieve the sports hall object and all of its sessions
    const SportsHallSessions = await SportsHall.findById(
      process.env.SportsHall_ID
    ).select("Activities");
    if (!SportsHallSessions)
      return res.status(404).json({ message: "Not Found", type: "error" });
    // Respond With data
    res
      .status(200)
      .json({ data: SportsHallSessions.Activities, type: "success" });
  } catch (error) {
    // Respond with error message
    res.status(500).json({ data: error.message, type: "error" });
  }
};

// AUTHENTICATION REQUIRED: PUT function used to modify the SportsHall
SportsHallRouter.put("/", ManagerAuthentication, async (req, res) => {
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
    // Update the sports hall attributes
    const sportHall = await SportsHall.findByIdAndUpdate(
      process.env.SportsHall_ID,
      update
    );
    if (!sportHall)
      res.status(404).json({ message: "Facility not found", type: "error" });
    // Responded to the user
    res.status(200).json({ message: "Sports Hall updated", type: "success" });
  } catch (error) {
    // Return if there is an error
    res.status(500).json({ message: error.message, type: "error" });
  }
});

const GetSportsHall = async (req,res) => {
  try {
    // Update the sports hall attributes
    const sportHall = await SportsHall.findById(process.env.SportsHall_ID);
    if (!sportHall)
      res.status(404).json({ message: "Facility not found", type: "error" });
    // Responded to the user
    res.status(200).json({ data: sportHall, type: "success" });
  } catch (error) {
    // Return if there is an error
    res.status(500).json({ message: error.message, type: "error" });
  }
};

SportsHallRouter.get("/", ManagerAuthentication, GetSportsHall);
SportsHallRouter.get("/customer", CustomerAuthentication, GetSportsHall);
SportsHallRouter.get("/employee", EmployeeAuthentication, GetSportsHall);

module.exports = { SportsHallRouter, SportsHallSessions };
