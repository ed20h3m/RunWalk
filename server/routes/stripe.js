const express = require("express");
const router = express.Router();
const cors = require("cors");
router.use(cors());
router.use(express.json());
const CustomerAuthentication = require("../Middleware/CustomerAuthentication");
const EmployeeAuthentication = require("../Middleware/EmployeeAuthentication");
require("dotenv").config();
// const { SendEmail } = require("../Email");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const MakePayment = async (req, res) => {
  try {
    const line_items = req.body.items.map((item) => {
      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: `${
              item.Facility[0].toUpperCase() + item.Facility.slice(1)
            }: ${item.Duration} mins ${
              item.Activity[0].toUpperCase() + item.Activity.slice(1)
            }`,
            metadata: {
              Activity: `Activity: ${item.Duration} ${item.Activity}`,
              Duration: `Duration: ${item.Duration}`,
              Facility: `Facility: ${item.Facility}`,
            },
          },
          unit_amount: item.Price * 100,
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIETN_URL}/success`,
      cancel_url: `${process.env.CLIETN_URL}/cancel`,
    });
    // SendEmail(req.body.items[0].Email, req.body.items);
    res.status(200).json({ url: session.url, type: "success" });
  } catch (error) {
    res.status(200).json({ message: error.message, type: "error" });
  }
};

router.post("/customer", CustomerAuthentication, MakePayment);
router.post("/employee", EmployeeAuthentication, MakePayment);

module.exports = router;
