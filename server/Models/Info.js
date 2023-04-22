const mongoose = require("mongoose");
const InfoSchema = mongoose.Schema({
  AnnualPrice: {
    type: Number,
    required: true,
    default: 300,
  },
  MonthlyPrice: {
    type: Number,
    required: true,
    default: 35,
  },
  Discount: {
    type: Number,
    required: true,
    default: 15,
  },
});

module.exports = mongoose.model("Info", InfoSchema, "Info");
