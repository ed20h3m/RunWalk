// This is where all the customer requests is handled

// Import all required packages and router
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt_decode = require("jwt-decode");
const router = express.Router();
const CustomerAuthentication = require("../Middleware/CustomerAuthentication");
const {
  CustomerSchema,
  CustomerSchemaPut,
  CustomerSchemaPassword,
} = require("../Schemas/CustomerSchema");
const Customer = require("../Models/Customer");
const Session = require("../Models/Session");
const { SendEmail } = require("../Email");
router.use(express.json());

// GET: used to get a customer from the database based on the _id
router.get("/", CustomerAuthentication, async (req, res) => {
  try {
    const _id = jwt_decode(req.headers.token);
    if (!_id)
      return res
        .status(404)
        .json({ message: "Customer id not found", type: "error" });
    // try to find customer based on id
    const customer = await Customer.findById(_id.id)
      .select("-__v")
      .select("-_id");
    // Check if customer exists
    if (!customer)
      return res
        .status(400)
        .json({ message: "Customer not found", type: "error" });
    // if customer found return it to front end
    return res.status(200).json({ data: customer, type: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, type: "error" });
  }
});

// POST /: Used for customer sign up - Receives a customer object from the front-end - AUTHENTICATION: NO
router.post("/", async (req, res) => {
  try {
    // Extract attributes from the body
    let { FirstName, LastName, Email, Password, isMember, subId } = req.body;

    // Check if there is an error in validating the syntax
    const { error } = CustomerSchema.validate(req.body);

    // Check if there is an error and respond
    if (error)
      return res.status(400).json({
        message: error.details[0].message.replace(/"/g, ""),
        type: "error",
      });

    // Check if email exits
    const email = await Customer.findOne({ Email });

    // Return error if email is taken
    if (email)
      return res.status(400).json({ message: "Email Taken", type: "error" });

    //Hash Password:
    const salt = await bcrypt.genSalt(10);
    Password = await bcrypt.hash(Password, salt);

    // Create a new Customer
    const update = new Customer({
      FirstName,
      LastName,
      Email,
      Password,
      isMember,
      subId,
    });

    // Save the Customer to the database
    await update.save();

    // console.log(update);
    // Send Email to user
    const content = {
      subject: "Welcome to Sports centre",
      description: "Thanks for registering with us 🌎",
    };
    // SendEmail(Email, content);

    // Else Respond with a success message
    res.status(200).json({
      message: "Sign-up Complete",
      type: "success",
    });
  } catch (error) {
    // Log the message to the terminal
    res.status(500).json({ message: error.message, type: "error" });
  }
});

// PUT /: Used for amendments - Receives a customer object from the front-end - AUTHENTICATION: YES
router.put("/", CustomerAuthentication, async (req, res) => {
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
          // SendEmail(update.Email, content);
        }
      }
      // Finally update database
      await Customer.findByIdAndUpdate(customerId, update);
    }
    // Return a response
    res.status(200).json({ message: "Profile Updated", type: "success" });
  } catch (error) {
    // Check if an error occurs and send a response
    res.status(500).json({ message: error.message, type: "error" });
  }
});

// POST /change-password: Used to change user password - Receives password , id and email from the front-end -  AUTHENTICATION: YES
router.put("/change-password", CustomerAuthentication, async (req, res) => {
  // Destruct customer object from the request body
  const { customer } = req.body;

  if (!customer)
    return res.status(400).json({
      message: "No customer object",
      type: "error",
    });

  // Check if there is a syntax error or if there is an attribute missing from the object
  const { error } = CustomerSchemaPassword.validate(customer);

  // return if there is an error
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });

  // Encrypt the new password
  const salt = await bcrypt.genSalt(10);
  const Password = await bcrypt.hash(customer.Password, salt);

  // Update the database with the new password
  const customerUpdate = await Customer.findByIdAndUpdate(customer._id, {
    Password,
  });

  // Send Email to user
  const content = {
    subject: "Password Change",
    description: `Hello ${customerUpdate.FirstName}, this email is to inform you that your password has been changed 🌎`,
  };
  // SendEmail(customerUpdate.Email, content);

  res.status(200).json({ message: "Password Changed", type: "success" });
});

router.delete("/", async (req, res) => {
  await Customer.deleteMany();
  await Session.deleteMany();
  // res.json({ message: "All Deleted", type: "success" });
});

module.exports = router;
