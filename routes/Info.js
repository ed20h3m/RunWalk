const express = require("express");
const router = express.Router();
router.use(express.json());
const Info = require("../Models/Info");
const CustomerAuthentication = require("../Middleware/CustomerAuthentication");
const EmployeeAuthentication = require("../Middleware/EmployeeAuthentication");
const ManagerAuthentication = require("../Middleware/ManagerAuthentication");
const { InfoSchemaPut } = require("../Schemas/InfoSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Information = async (req, res) => {
  try {
    const info = await Info.findById("63f4d966ba51cda0beddb607")
      .select("-_id")
      .select("-__v");
    return res.status(200).json({ data: info, message: "success" });
  } catch (error) {
    res.status(200).json({ message: error.message, message: "error" });
  }
};

const PutInformation = async (req, res) => {
  const { update } = req.body;

  if (!update) {
    return res
      .status(404)
      .json({ message: "update object not found", type: "error" });
  }
  const { error } = InfoSchemaPut.validate(update);
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });
  try {
    const info = await Info.findByIdAndUpdate(
      "63f4d966ba51cda0beddb607",
      update
    );
    if (update.MonthlyPrice !== info.MonthlyPrice) {
      const price = await stripe.prices.create({
        product: "prod_Nav9YtxTWpvmRR",
        unit_amount: update.MonthlyPrice * 100,
        currency: "gbp",
        recurring: { interval: "month" },
        lookup_key: "standard_monthly",
        transfer_lookup_key: true,
      });
      await stripe.products.update("prod_Nav9YtxTWpvmRR", {
        default_price: price.id,
      });
    }
    if (update.AnnualPrice !== info.AnnualPrice) {
      const price = await stripe.prices.create({
        product: "prod_NbC9bn8OHuKL6R",
        unit_amount: update.AnnualPrice * 100,
        currency: "gbp",
        recurring: { interval: "year" },
        lookup_key: "yearly",
        transfer_lookup_key: true,
      });
      await stripe.products.update("prod_NbC9bn8OHuKL6R", {
        default_price: price.id,
      });
    }
    if (info)
      return res
        .status(200)
        .json({ message: "Information Updated", type: "success" });
  } catch (error) {
    res.status(200).json({ message: error.message, type: "error" });
  }
};

router.get("/customer", CustomerAuthentication, Information);
router.get("/employee", EmployeeAuthentication, Information);

router.get("/manager", ManagerAuthentication, Information);
router.put("/manager", ManagerAuthentication, PutInformation);

module.exports = router;
