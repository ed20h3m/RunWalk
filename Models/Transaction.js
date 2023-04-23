const mongoose = require("mongoose");
const TransactionSchema = mongoose.Schema(
  {
    Email: {
      type: String,
      required: true,
    },
    TotalAmount: {
      type: Number,
      required: true,
    },
    Date: {
      type: String,
      required: true,
    },
    Items: {
      type: Array,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model(
  "Transaction",
  TransactionSchema,
  "Transaction"
);
