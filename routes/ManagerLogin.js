// This is where the manager login takes place

// Import required packages
const express = require("express");
const app = express();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ManagerSchemaLogin } = require("../Schemas/ManagerSchema");
const Manager = require("../Models/Manager");
app.use(express.json());

// POST METHOD : Used for manager login
app.post("/", async (req, res) => {
  // Destruct Email and password from request object
  const { Email, Password } = req.body;
  // Check if there is a syntax error
  const { error } = ManagerSchemaLogin.validate(req.body);
  // If there is an error return to manager
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });

  try {
    // CHECK EMAIL
    // Check if the manager exists in the database
    const manager = await Manager.findOne({ Email })
      .select("Email")
      .select("Password");
    // If not return error message to manager
    if (!manager)
      return res.status(400).json({
        message: "Incorrect Email/Password try again !!",
        type: "error",
      });
    // CHECK PASSWORD
    const isCorrect = await bcrypt.compare(Password, manager.Password);
    if (!isCorrect)
      return res.status(400).json({
        message: "Incorrect Email/Password try again !! -",
        type: "error",
      });
    // Check is manager is suspended
    if (manager.isActive == false)
      return res.status(400).json({
        message: "You Are suspended",
        type: "error",
      });
    // Assign token to manager once authenticated
    const token = JWT.sign({ id: manager._id }, process.env.TOKEN_SECRET_2, {
      expiresIn: "1h",
    });
    // Respond with a valid token once manager is logged in
    res.status(200).json({ Token: token, type: "success" });
    // Check if there is a server error
  } catch (error) {
    // If error return to manager
    res.status(500).json({ message: error.message, type: "error" });
  }
});

module.exports = app;
