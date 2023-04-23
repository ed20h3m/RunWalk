// This is where customer login requests take place

// Import all packages required
const express = require("express");
const app = express();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Customer = require("../Models/Customer");
const { CustomerSchemaLogin } = require("../Schemas/CustomerSchema");
app.use(express.json());

app.post("/", async (req, res) => {
  // Destruct attributes from the request body
  const { Email, Password } = req.body;
  // Check if there are any syntax errors
  const { error } = CustomerSchemaLogin.validate(req.body);

  // Return if there is an error
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });

  try {
    // Check if the details are consistent with the database
    const customer = await Customer.findOne({ Email });

    // If Customer not found return error
    if (!customer)
      return res.status(400).json({
        message: "Incorrect Email/Password Try again!",
        type: "error",
      });

    // Check if the password i consistent with the database and the email
    const isCorrect = await bcrypt.compare(Password, customer.Password);

    // If not return error
    if (!isCorrect)
      return res.status(400).json({
        message: "Incorrect Email/Password Try again!",
        type: "error",
      });

    // If both email an  password are correct => Respond with a JSON web Token
    const token = JWT.sign({ id: customer._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });
    // Respond with a token
    res.status(200).json({ Token: token, type: "success" });
  } catch (error) {
    // Respond with error
    res.status(500).json({ message: error.message, type: "error" });
  }
});

module.exports = app;
