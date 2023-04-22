const mongoose = require("mongoose");
const FitnessRoomSchema = mongoose.Schema({
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
        Link: "https://www.the-connaught.co.uk/siteassets/aman-spa/gym/gym-hero.jpg",
        Facility: "fitness room"
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
  "FitnessRoom",
  FitnessRoomSchema,
  "FitnessRoom"
);
