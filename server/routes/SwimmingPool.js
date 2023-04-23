// This file is used to modify swimming pool attributes

// Import
const express = require("express");
const PoolRouter = express.Router();
PoolRouter.use(express.json());
const Pool = require("../Models/SwimmingPool");
require("dotenv").config();
const ManagerAuthentication = require("../Middleware/ManagerAuthentication");
const CustomerAuthentication = require("../Middleware/CustomerAuthentication");
const EmployeeAuthentication = require("../Middleware/EmployeeAuthentication");
const { SessionSchema } = require("../Schemas/FacilitySchema");

// AUTHENTICATED ROUTE
PoolRouter.put("/", ManagerAuthentication, async (req, res) => {
  // Destruct the update object from the request body
  const { update } = req.body;
  // Check if an update object is provided
  if (!update)
    return res.status(400).json({
      message: "No updates provided",
      type: "error",
    });
  // Check if there is a syntax error
  const { error } = SessionSchema.validate(update);
  // Respond if there is an error
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });
  try {
    // Update the pool attributes in the database
    const pool = await Pool.findByIdAndUpdate(process.env.Pool_ID, update);
    if (!pool)
      return res.status(400).json({ message: "Pool not found", type: "error" });
    // return a response to the user
    res.status(200).json({ massage: "Swimming-pool updated", type: "success" });
  } catch (error) {
    // Return if there is an error
    res.status(500).json({ massage: error.message, type: "error" });
  }
});

const GetPool = async (req, res) => {
  try {
    // Update the pool attributes in the database
    const pool = await Pool.findById(process.env.Pool_ID);
    if (!pool)
      return res.status(400).json({ message: "Pool not found", type: "error" });
    // return a response to the user
    res.status(200).json({ data: pool, type: "success" });
  } catch (error) {
    // Return if there is an error
    res.status(500).json({ massage: error.message, type: "error" });
  }
};
// GET:: used to retrieve pool sessions only
const PoolSessions = async (req, res) => {
  try {
    // Retrieve the pool object and all of its sessions
    const PoolSessions = await Pool.findById(process.env.Pool_ID).select(
      "Activities"
    );
    if (!PoolSessions)
      return res.status(404).json({ message: "Not Found", type: "error" });
    // Respond With data
    res.status(200).json({ data: PoolSessions.Activities, type: "success" });
  } catch (error) {
    // Respond with error message
    res.status(500).json({ data: error.message, type: "error" });
  }
};
PoolRouter.get("/", ManagerAuthentication, GetPool);
PoolRouter.get("/customer", CustomerAuthentication, GetPool);
PoolRouter.get("/employee", EmployeeAuthentication, GetPool);

module.exports = { PoolRouter, PoolSessions };
