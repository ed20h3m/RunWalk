// This is where the SquashCourt1 attributes are modified

// Import required packages

const express = require("express");
const SquashCourt2Router = express.Router();
SquashCourt2Router.use(express.json());
require("dotenv").config();
const SquashCourt2 = require("../Models/SquashCourt2");
const { SessionSchema } = require("../Schemas/FacilitySchema");
const ManagerAuthentication = require("../Middleware/ManagerAuthentication");
const CustomerAuthentication = require("../Middleware/CustomerAuthentication");
const EmployeeAuthentication = require("../Middleware/EmployeeAuthentication");

// AUTHENTICATION REQUIRED: PUT function used to modify the SquashCourt2
const SquashCourt2Sessions = async (req, res) => {
  try {
    // Retrieve the SquashCourt2Sessions object and all of its sessions
    const SquashCourt2Sessions = await SquashCourt2.findById(
      process.env.Squash_Court_2_ID
    ).select("Activities");
    if (!SquashCourt2Sessions)
      return res.status(404).json({ message: "Not Found", type: "error" });
    // Respond With data
    res
      .status(200)
      .json({ data: SquashCourt2Sessions.Activities, type: "success" });
  } catch (error) {
    // Respond with error message
    res.status(500).json({ data: error.message, type: "error" });
  }
};

SquashCourt2Router.put("/", ManagerAuthentication, async (req, res) => {
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
    // Update the Squash Court 1 attributes
    const court = await SquashCourt2.findByIdAndUpdate(
      process.env.Squash_Court_2_ID,
      update
    );
    // Check if the court exists
    if (!court)
      return res
        .status(400)
        .json({ message: "Court not found", type: "error" });
    // Responded to the user
    res
      .status(200)
      .json({ message: "Squash Court 2 updated", type: "success" });
  } catch (error) {
    // Return if there is an error
    res.status(500).json({ message: error.message, type: "error" });
  }
});

const GetSquashCourt2 = async (req, res) => {
  try {
    // Update the Squash Court 1 attributes
    const court = await SquashCourt2.findById(process.env.Squash_Court_2_ID);
    // Check if the court exists
    if (!court)
      return res
        .status(400)
        .json({ message: "Court not found", type: "error" });
    // Responded to the user
    res.status(200).json({ data: court, type: "success" });
  } catch (error) {
    // Return if there is an error
    res.status(500).json({ message: error.message, type: "error" });
  }
};

SquashCourt2Router.get("/", ManagerAuthentication, GetSquashCourt2);
SquashCourt2Router.get("/customer", CustomerAuthentication, GetSquashCourt2);
SquashCourt2Router.get("/employee", EmployeeAuthentication, GetSquashCourt2);

module.exports = { SquashCourt2Router, SquashCourt2Sessions };
