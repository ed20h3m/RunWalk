const mongoose = require("mongoose");
const StudioSchema = mongoose.Schema({
  Capacity: {
    type: Number,
    require: true,
    default: 25,
  },
  Activities: {
    type: Array,
    require: true,
    default: [
      {
        Activity: "Exercise classes",
        Duration: 60,
        Price: 0.0,
        Link: "https://robbreport.com/wp-content/uploads/2022/07/Himat_WeightRoom.jpg?w=1000",
        Facility: "studio",
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
module.exports = mongoose.model("Studio", StudioSchema, "Studio");
