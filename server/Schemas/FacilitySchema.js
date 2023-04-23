const hapi = require("@hapi/joi");

const SessionSchema = hapi.object({
  Capacity: hapi.number(),
  Activities: hapi.array().items(
    hapi.object({
      Activity: hapi.string(),
      Link: hapi.string(),
      Facility: hapi.string(),
      Duration: hapi.number(),
      Price: hapi.number(),
    })
  ),
  // Price: hapi.number(),
});

module.exports = { SessionSchema };
