const mongoose = require("mongoose");
const ClimbingWallSchema = mongoose.Schema({
  Capacity: {
    type: Number,
    require: true,
    default: 45,
  },
  Activities: {
    type: Array,
    require: true,
    default: [
      {
        Activity: "General Use",
        Duration: 60,
        Price: 0.0,
        Link: "https://media.timeout.com/images/103733032/750/562/image.jpg",
        Facility: "climbing wall",
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
  "ClimbingWall",
  ClimbingWallSchema,
  "ClimbingWall"
);
