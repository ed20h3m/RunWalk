// This is where the studio attributes are modified

// Import required packages

const express = require("express");
const StudioRouter = express.Router();
StudioRouter.use(express.json());
require("dotenv").config();
const Studio = require("../Models/Studio");
const ManagerAuthentication = require("../Middleware/ManagerAuthentication");
const { SessionSchema } = require("../Schemas/FacilitySchema");
const CustomerAuthentication = require("../Middleware/CustomerAuthentication");
const EmployeeAuthentication = require("../Middleware/EmployeeAuthentication");

// AUTHENTICATION REQUIRED: PUT function used to modify the studio

StudioRouter.put("/", ManagerAuthentication, async (req, res) => {
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
    const studio = await Studio.findByIdAndUpdate(
      process.env.Studio_ID,
      update
    );
    if (!studio)
      return res
        .status(404)
        .json({ message: "Studio not found", type: "error" });
    // Responded to the user
    res.status(200).json({ message: "Studio updated", type: "success" });
  } catch (error) {
    // Return if there is an error
    res.status(500).json({ message: error.message, type: "error" });
  }
});

const GetStudio = async (req,res) => {
  try {
    // retrieve studio from database
    const studio = await Studio.findById(process.env.Studio_ID);
    if (!studio) return res.status(404).json({ data: studio, type: "error" });
    // Responded to the user
    res.status(200).json({ data: studio, type: "success" });
  } catch (error) {
    // Return if there is an error
    res.status(500).json({ message: error.message, type: "error" });
  }
};

StudioRouter.get("/", ManagerAuthentication, GetStudio);
StudioRouter.get("/customer", CustomerAuthentication, GetStudio);
StudioRouter.get("/employee", EmployeeAuthentication, GetStudio);

const StudioSessions = async (req, res) => {
  try {
    // Retrieve the pool object and all of its sessions
    const StudioSessions = await Studio.findById(process.env.Studio_ID).select(
      "Activities"
    );
    if (!StudioSessions)
      return res.status(404).json({ message: "Not Found", type: "error" });
    // Respond With data
    res.status(200).json({ data: StudioSessions.Activities, type: "success" });
  } catch (error) {
    // Respond with error message
    res.status(500).json({ message: error.message, type: "error" });
  }
};
module.exports = { StudioRouter, StudioSessions };
