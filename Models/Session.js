const mongoose = require("mongoose");

const SessionSchema = mongoose.Schema(
  {
    Email: {
      type: String,
      require: true,
    },
    Facility: {
      type: String,
      require: true,
    },
    Activity: {
      type: String,
      require: true,
    },
    Date: {
      type: String,
      require: true,
    },
    CreatedDate: {
      type: Date,
      require: true,
    },
    Duration: {
      type: Number,
      require: true,
    },
    Status: {
      type: String,
      required: true,
      // pending , attended , canceled, unattended
      default: "pending",
    },
    Price: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);
module.exports = mongoose.model("Session", SessionSchema, "Session");
