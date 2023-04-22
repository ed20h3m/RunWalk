const mongoose = require("mongoose");
const SquashCourt1Schema = mongoose.Schema({
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
        Link: "https://pennracquetsports.com/common/controls/image_handler.aspx?thumb_id=0&image_path=/images/2019/11/12/Racquet_Facilties_2019_HM_0900.JPG",
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
  "SquashCourt1",
  SquashCourt1Schema,
  "SquashCourt1"
);
