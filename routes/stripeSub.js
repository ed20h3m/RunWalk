const express = require("express");
const router = express.Router();
const cors = require("cors");
router.use(cors());
router.use(express.json());
const CustomerAuthentication = require("../Middleware/CustomerAuthentication");
const EmployeeAuthentication = require("../Middleware/EmployeeAuthentication");
require("dotenv").config();

const stripe = require("stripe")(
  "sk_test_51MlBZHFi0ADzfbva1UjwNVVstqe7Jpqh5eaibsM92PmKpBEpUfP81cpAySUDLA4TvyAzjhqiI2qf1kzBeSJgcEiX00OW7ph683"
);

router.post("/", async (req, res) => {
  try {
    // create a stripe customer
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
      payment_method: req.body.paymentMethod,
      invoice_settings: {
        default_payment_method: req.body.paymentMethod,
      },
    });

    // get the price id from the front-end
    const priceId = req.body.priceId;

    // create a stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_settings: {
        payment_method_options: {
          card: {
            request_three_d_secure: "any",
          },
        },
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });
    // console.log(subscription);
    // return the client secret and subscription id
    // clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    // subscriptionId: subscription.id,
    res.status(200).json({
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      subscription: subscription,
      type: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, type: "error" });
  }
});

module.exports = router;
