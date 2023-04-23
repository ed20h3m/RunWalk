const mongoose = require("mongoose");
const SquashCourt2Schema = mongoose.Schema({
  Capacity: {
    type: Number,
    require: true,
    default: 4,
  },
  Activities: {
    type: Array,
    require: true,
    default: [
      {
        Activity: "1-hour sessions",
        Duration: 60,
        Price: 0.0,
        Link: "https://c8.alamy.com/comp/2HK616W/squash-court-sport-2HK616W.jpg",
        Facility: "squash court1",
      },
    ],
  },
  OpenTime: {
    type: String,
    require: true,
    default: "8am",
  },
  CloseTime: {
    type: String,
    require: true,
    default: "10pm",
  },
});
module.exports = mongoose.model(
  "SquashCourt2",
  SquashCourt2Schema,
  "SquashCourt2"
);
