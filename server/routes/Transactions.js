const express = require("express");
const router = express.Router();
router.use(express.json());
const Transaction = require("../Models/Transaction");
const CustomerAuthentication = require("../Middleware/CustomerAuthentication");
const EmployeeAuthentication = require("../Middleware/EmployeeAuthentication");
const { TransactionSchema } = require("../Schemas/TransactionSchema");

const CreateTransaction = async (req, res) => {
  const { Items, Email } = req.body;
  try {
    if (Items.length < 1)
      return res.status(400).json({
        message: "No Items Found",
        type: "error",
      });
    const { error } = TransactionSchema.validate(req.body);
    if (error)
      return res.status(400).json({
        message: error.details[0].message.replace(/"/g, ""),
        type: "error",
      });
    let Total = 0;
    Items.forEach((item) => {
      Total += item.Price;
      item.Date = item.Date + " " + item.Time.slice(0, 3) + "00";
      delete item.Time;
      delete item.Link;
      delete item.Email;
    });

    const transaction = new Transaction({
      Email: Email,
      Items: Items,
      TotalAmount: Total,
      Date: new Date().toISOString().slice(0, 10),
    });
    await transaction.save();

    res.status(200).json({
      message: "Transaction Created",
      type: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      type: "error",
    });
  }
};

router.post("/customer", CustomerAuthentication, CreateTransaction);
router.post("/employee", EmployeeAuthentication, CreateTransaction);

module.exports = router;
