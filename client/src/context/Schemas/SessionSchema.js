const hapi = require("@hapi/joi");

const SessionSchema = hapi.object({
  Email: hapi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
  Facility: hapi.string().required(),
  Activity: hapi.string().required(),
  Date: hapi.string().required(),
  Duration: hapi.number().required(),
  Price: hapi.number().required(),
  Status: hapi.string(),
});

const SessionSchemaPut = hapi.object({
  _id: hapi.string().required(),
  Email: hapi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
  Facility: hapi.string(),
  Activity: hapi.string(),
  Date: hapi.string(),
  Duration: hapi.number(),
  Price: hapi.number(),
  Status: hapi.string(),
  arrayName: hapi.string(),
  created_at:hapi.date(),
  updatedAt:hapi.date()
});

module.exports = {
  SessionSchema,
  SessionSchemaPut,
};
