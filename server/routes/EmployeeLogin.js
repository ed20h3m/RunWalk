// This is where the employee login is handled

// Import Required packages
const express = require("express");
const router = express.Router();
router.use(express.json());
const bcrypt = require("bcryptjs");
const { EmployeeSchemaLogin } = require("../Schemas/EmployeeSchema");
const Employee = require("../Models/Employee");
const JWT = require("jsonwebtoken");
// PUT: used authenticate employee: AUTHENTICATION: NO
router.post("/", async (req, res) => {
  // Destruct Email and password from request object
  const { EmployeeObj } = req.body;

  // Check if  email and password are provided
  if (!EmployeeObj)
    return res.status(400).json({ message: "Missing Details", type: "error" });

  // Check email and password syntax
  const { error } = EmployeeSchemaLogin.validate(EmployeeObj);

  // return if there is an error
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: error,
    });
  try {
    // Check if employee exists in the database
    const employee = await Employee.findOne({ Email: EmployeeObj.Email });
    // return error if there is no employee
    if (!employee)
      return res.status(404).json({
        message: "Incorrect Email/Password try again !!",
        type: "error",
      });

    const isCorrect = await bcrypt.compare(EmployeeObj.Password, employee.Password);
    // isCorrect == false
    if (!isCorrect)
      return res.status(404).json({
        message: "Incorrect Email/Password try again !!",
        type: "error",
      });
    // Check if employee is suspended
    if (employee.isSuspended)
      return res.status(404).json({
        message: "You are Not allowed to login: You Have been suspended !!",
        type: "error",
      });
    // Create a new token
    const token = JWT.sign({ id: employee._id }, process.env.TOKEN_SECRET_3, {
      expiresIn: "4h",
    });
    // Send token to employee to access routes
    res.status(200).json({ Token: token, type: "success" });
  } catch (error) {
    // return if there are server errors
    res.status(500).json({ message: error.message, type: "error" });
  }
});

module.exports = router;
