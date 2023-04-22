// This is where the manager actions take place

// Import required packages
const express = require("express");
const router = express.Router();
router.use(express.json());
const {
  ManagerSchema,
  ManagerSchemaPut,
  ManagerSchemaPassword,
} = require("../Schemas/ManagerSchema");
const { InfoSchemaPut } = require("../Schemas/InfoSchema");
const Manager = require("../Models/Manager");
const bcrypt = require("bcryptjs");
const ManagerAuthentication = require("../Middleware/ManagerAuthentication");
const Info = require("../Models/Info");
const { SendEmail } = require("../Email");
const jwt_decode = require("jwt-decode");

// GET METHOD: used to get a certain manager object

router.get("/", ManagerAuthentication, async (req, res) => {
  try {
    const _id = jwt_decode(req.headers.token);
    if (!_id)
      return res
        .status(404)
        .json({ message: "Manager id not found", type: "error" });
    // try to find customer based on id
    const customer = await Manager.findById(_id.id)
      .select("-Password")
      .select("-__v")
      .select("-_id");
    // Check if customer exists
    if (!customer)
      return res
        .status(400)
        .json({ message: "Manager not found", type: "error" });
    // if customer found return it to front end
    return res.status(200).json({ data: customer, type: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, type: "error" });
  }
});

// POST METHOD: used to create a new manager
router.post("/", async (req, res) => {
  // Destruct error if there is any
  const { error } = ManagerSchema.validate(req.body);
  // If error is valid return to user
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });
  // Destruct Email from request object
  const { Email } = req.body;
  try {
    // Check if the email is not taken by another manager
    const found = await Manager.findOne({ Email });
    // If email is taken return with error response
    if (found)
      return res.status(400).json({ message: "Email Taken", type: "error" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    req.body.Password = await bcrypt.hash(req.body.Password, salt);

    // Create a new Manager object
    const manager = new Manager(req.body);
    // Save in the database
    await manager.save();
    res.status(200).json({ message: "Manager is created", type: "success" });
  } catch (error) {
    // Return with error response if an error occurs
    res.status(500).json({ message: error.message, type: "error" });
  }
});

// PUT METHOD: used to edit manager details
router.put("/", ManagerAuthentication, async (req, res) => {
  // Destruct update object from request body
  const { update } = req.body;
  // If there is no update object return error
  if (!update)
    return res.status(400).json({ message: "No update", type: "error" });

  // Check for syntax errors
  const { error } = ManagerSchemaPut.validate(update);
  // return error message
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });

  try {
    // Request Manager
    const manager = await Manager.findById(update._id).select("Email");

    // Check if emails are equal
    if (update.Email && update.Email !== manager.Email) {
      // Check if that email is taken by another manager
      const user = await Manager.findOne({ Email: update.Email });
      if (user)
        return res
          .status(400)
          .json({ message: "Email taken try again!", type: "error" });
    }
    // Store the id
    const id = update._id;
    // Delete the _id attribute
    delete update._id;
    // Check if there are any updates
    if (!(JSON.stringify(update) === "{}"))
      await Manager.findByIdAndUpdate(id, update); // Update the database
    // Return success response
    res
      .status(200)
      .json({ message: "Manager details updated", type: "success" });
  } catch (error) {
    res.status(500).json({ message: error.manager, type: "error" });
  }
});

// POST METHOD: used to reset password
router.put("/change-password", ManagerAuthentication, async (req, res) => {
  // Destruct manager object from request object
  const { manager } = req.body;
  if (!manager)
    return res.status(400).json({
      message: "Insufficient attributes provided",
      type: "error",
    });
  // Validate the syntax of the manager object
  const { error } = ManagerSchemaPassword.validate(manager);
  // If there is an error return to the manager
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const Password = await bcrypt.hash(manager.Password, salt);
  try {
    // Check if manager exits and updated
    const user = await Manager.findByIdAndUpdate(manager._id, {
      Password,
    }).select("Email");

    // if manager doesn't exist return error
    if (!user)
      return res.status(400).json({ message: "Invalid Email", type: "error" });

    // Construct Email content
    const content = {
      subject: "Password Change",
      description:
        "This Email is to inform you, your password has been changed",
    };

    // Send Email informing manager of the update
    SendEmail(user.Email, content);

    // Respond with success message
    res.status(200).json({ message: "Password Updated", type: "Success" });
  } catch (error) {
    res.status(500).json({ message: error.message, type: "error" });
  }
});

// PUT METHOD: used to amend information about the sports centre
router.put("/change-info", ManagerAuthentication, async (req, res) => {
  // Destruct update object from body
  const { update } = req.body;

  // Return if update not provided
  if (!update)
    return res.status(400).json({ message: "No updates", type: "error" });

  // Check if there is a syntax error
  const { error } = InfoSchemaPut.validate(update);
  // Return if there is syntax error
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });

  try {
    // perform the update on the database
    const info = await Info.findByIdAndUpdate(process.env.Info_ID, update);
    // if not updated return error message
    if (!info)
      return res.status(400).json({ message: "Not updated", type: "error" });
    // if updated successfully return success message
    res.status(200).json({ message: "Information Updated", type: "success" });
  } catch (error) {
    // Return server error
    res.status(500).json({ message: error.message, type: "error" });
  }
});

module.exports = router;
