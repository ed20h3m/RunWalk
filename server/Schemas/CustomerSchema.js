// This is the customer schema to validate the syntax

const hapi = require("@hapi/joi");

const CustomerSchema = hapi.object({
  _id: hapi.string(),
  FirstName: hapi.string().min(3).required(),
  LastName: hapi.string().min(3).required(),
  Email: hapi.string().email().required(),
  Password: hapi.string().min(8).required(),
  isMember: hapi.boolean().required(),
  subId: hapi.string().allow("").required(),
});
const CustomerSchemaPut = hapi.object({
  _id: hapi.string().required(),
  FirstName: hapi.string().min(3),
  LastName: hapi.string().min(3),
  Email: hapi.string().email(),
  Password: hapi.string().min(8),
  isMember: hapi.boolean(),
  subId: hapi.string().allow(""),
});

const CustomerSchemaLogin = hapi.object({
  Email: hapi.string().email().required(),
  Password: hapi.string().min(8).required(),
});
const CustomerSchemaPassword = hapi.object({
  _id: hapi.string().required(),
  Password: hapi.string().min(8).required(),
});
const CustomerId = hapi.object({
  _id: hapi.string().required(),
});

module.exports = {
  CustomerId,
  CustomerSchema,
  CustomerSchemaLogin,
  CustomerSchemaPut,
  CustomerSchemaPassword,
};
