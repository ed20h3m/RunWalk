const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    subId: {
      type: String,
      required: true,
    },
    isMember: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Customer", CustomerSchema, "Customer");
