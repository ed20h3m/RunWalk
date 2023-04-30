// This is where all the employee requests are handled

const express = require("express");
const router = express.Router();
router.use(express.json());
const Employee = require("../Models/Employee");
const Customer = require("../Models/Customer");
const {
  EmployeeSchema,
  EmployeeSchemaPut,
  EmployeeSchemaPassword,
} = require("../Schemas/EmployeeSchema");
const { CustomerSchemaPut } = require("../Schemas/CustomerSchema");
const { EmailSchema } = require("../Schemas/AttSchema");
const ManagerAuthentication = require("../Middleware/ManagerAuthentication");
const EmployeeAuthentication = require("../Middleware/EmployeeAuthentication");
const bcrypt = require("bcryptjs");

// POST: used to create a new employee by the manager: AUTHENTICATION: YES
router.post("/", ManagerAuthentication, async (req, res) => {
  // Destruct employee object from request body
  const { employeeObj } = req.body;
  if (!employeeObj)
    return res.status(400).json({ message: "Missing Details", type: "error" });
  // Check for any syntax errors
  const { error } = EmployeeSchema.validate(employeeObj);
  // If error, return with a message
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });
  // Check if email is taken
  const user = await Employee.findOne({ Email: employeeObj.Email });
  // Return error if email is taken
  if (user)
    return res
      .status(400)
      .json({ message: "Email Taken, try again!", type: "error" });
  // Create new employee
  const employee = new Employee(employeeObj);
  employee.isSuspended = false;
  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const Password = await bcrypt.hash(employee.Password, salt);
  employee.Password = Password;
  try {
    // Save employee to database
    const object = await employee.save();
    if (!object)
      return res
        .status(400)
        .json({ message: "Employee wasn't added", type: "error" });
    res.status(200).json({ message: "Employee Added", type: "success" });
  } catch (error) {
    // if server error return to user
    res.status(500).json({ message: error.message, type: "error" });
  }
});

// PUT: used to amend employee by the manager: AUTHENTICATION: YES
router.put("/", ManagerAuthentication, async (req, res) => {
  // Destruct update object
  const { update } = req.body;

  // Check if update object is provided
  if (!update)
    return res.status(400).json({
      message: "No update details",
      type: "error",
    });
  // Check for syntax errors
  const { error } = EmployeeSchemaPut.validate(update);
  // Return if there is errors
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });
  try {
    // Updated Employee account
    await Employee.findByIdAndUpdate(update._id, update);
    res.status(200).json({ message: "Update complete", type: "success" });
  } catch (error) {
    // return if there are server errors
    res.status(500).json({ message: error.message, type: "error" });
  }
});

// PUT: used to get all employees by the manager: AUTHENTICATION: YES
router.get("/", ManagerAuthentication, async (req, res) => {
  try {
    // Get all employees
    const employees = await Employee.find();
    // return to manager
    res.status(200).json({ data: employees, type: "success" });
  } catch (error) {
    // return if there are server errors
    res.status(500).json({ message: error.message, type: "error" });
  }
});

// PUT: used to find one specific employee by the manager: AUTHENTICATION: YES
router.get("/find-one", ManagerAuthentication, async (req, res) => {
  // Destruct _id from request object
  const _id = req.header("_id");
  // if no id is provided: => return error message
  if (!_id)
    return res
      .status(400)
      .json({ message: "id was not provided", type: "error" });
  try {
    // search for employee
    const employee = await Employee.findById(_id);
    // if not found return error
    if (!employee)
      return res
        .status(404)
        .json({ message: "No employees found", type: "war" });
    // Return employee to manager
    res.status(200).json({ data: employee, type: "success" });
  } catch (error) {
    // return if there are server errors
    res.status(500).json({ message: error.message, type: "error" });
  }
});

// PUT: used for employee to change their password
router.put("/forgot-password", async (req, res) => {
  // Destruct customer object from the request body
  const { update } = req.body;

  if (!update)
    return res.status(400).json({
      message: "No employee object",
      type: "error",
    });

  // Check if there is a syntax error or if there is an attribute missing from the object
  const { error } = EmployeeSchemaPassword.validate(update);

  // return if there is an error
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });

  // Encrypt the new password
  const salt = await bcrypt.genSalt(10);
  const Password = await bcrypt.hash(update.Password, salt);

  // Update the database with the new password
  await Employee.findByIdAndUpdate(update._id, {
    Password,
  });

  res.status(200).json({ message: "Password Changed", type: "success" });
});

router.post("/get-customer", EmployeeAuthentication, async (req, res) => {
  const { Email } = req.body;
  try {
    const { error } = EmailSchema.validate({ Email });
    if (error)
      return res.status(400).json({
        message: error.details[0].message.replace(/"/g, ""),
        type: "error",
      });
    const customer = await Customer.findOne({ Email });
    if (!customer)
      return res
        .status(404)
        .json({ message: "customer not found", type: "error" });

    res.status(200).json({ data: customer, type: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, type: "error" });
  }
});

router.put("/edit-customer", EmployeeAuthentication, async (req, res) => {
  // Destruct the customer object from the request body
  const { update } = req.body;

  // If there isn't a customer object return error
  if (!update)
    return res.status(400).json({ message: "No Updates", type: "error" });

  // Validate the the syntax of the attributes
  const { error } = CustomerSchemaPut.validate(update);

  if (error)
    // return if there is an error
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });
  // Check if there the user id is in the request object
  if (!update._id)
    // Return if there is an error
    return res.status(400).json({
      message: "Access Denied: id not found",
      type: "error ",
    });

  // Email Object
  const content = {
    subject: "Account Details Changed",
    description:
      "This is an email to inform you that your account details have been updated 🌎",
  };

  try {
    // Find the customer's details in the database based on the id
    // Exclude unnecessary attributes such as id and password
    const customer = await Customer.findById(update._id)
      .select("-_id")
      .select("-__v")
      .select("-Password");
    // Store customer id in a variable
    const customerId = update._id;
    // Delete the id attribute from the object to compare the old and the new objects
    delete update._id;
    // Compare the objects to see if they are identical
    if (JSON.stringify(customer) !== JSON.stringify(update)) {
      if (update.Email) {
        if (customer.Email !== update.Email) {
          // Check if emails are the same
          const email = await Customer.findOne({ Email: update.Email });
          // If not check the new email is not taken before performing the update
          if (email)
            return res
              .status(400)
              .json({ message: "Email Taken", type: "error" });
          // Send Email to user
          content.description =
            "This is an email to inform your account email is changed 🌎";
        }
      }
      // Finally update database
      await Customer.findByIdAndUpdate(customerId, update);
    }
    // Return a response
    res.status(200).json({ message: "Updated", type: "success" });
  } catch (error) {
    // Check if an error occurs and send a response
    res.status(500).json({ message: error.message, type: "error" });
  }
});

module.exports = router;
