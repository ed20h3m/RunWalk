const mongoose = require("mongoose");
const PoolSchema = mongoose.Schema({
  Capacity: {
    type: Number,
    require: true,
    default: 30,
  },
  Activities: {
    type: Array,
    require: true,
    default: [
      {
        Activity: "General Use",
        Duration: 60,
        Price: 0.0,
        Link: "http://static1.squarespace.com/static/5f06d673352720325a1f3b5d/t/6128c582b528ce44fb721512/1630061954336/DSC05812.jpg?format=1500w",
        Facility: "swimming pool",
      },
      {
        Activity: "Lane Swimming",
        Duration: 60,
        Price: 0.0,
        Link: "https://i2-prod.examinerlive.co.uk/incoming/article20600490.ece/ALTERNATES/s1200d/1_Hathersage-Swimming-Pool.jpg",
        Facility: "swimming pool",
      },
      {
        Activity: "Lessons",
        Duration: 60,
        Price: 0.0,
        Link: "https://www.mclarenleisure.co.uk/wp-content/uploads/2016/06/272165014_4841227842630051_227546908266431102_n-1024x644.jpg",
        Facility: "swimming pool",
      },
      {
        Activity: "Team Events",
        Duration: 120,
        Price: 0.0,
        Link: "https://www.worcester.gov.uk/images/easyblog_shared/Generic_images/b2ap3_amp_Perdiswell-Swimming-Pool.jpg",
        Facility: "swimming pool",
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
    default: "8pm",
  },
});
module.exports = mongoose.model("Pool", PoolSchema, "Pool");
