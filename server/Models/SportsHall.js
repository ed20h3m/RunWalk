const mongoose = require("mongoose");
const SportsHallSchema = mongoose.Schema({
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
        Activity: "1-hour sessions",
        Duration: 60,
        Price: 0.0,
        Link: "https://www.neptunus.co.uk/wp-content/uploads/2019/05/Hamstel-Infant-School-8.jpg",
        Facility: "sports hall",
      },
      {
        Activity: "Team events",
        Duration: 120,
        Price: 0.0,
        Link: "https://d2c6s77msf04pp.cloudfront.net/uploads/content/img-5183-edit-5f7da8fe27ae0.jpg",
        Facility: "sports hall",
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
module.exports = mongoose.model("SportsHall", SportsHallSchema, "SportsHall");
