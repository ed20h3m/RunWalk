// This is the manager schema to validate the syntax

const hapi = require("@hapi/joi");

const ManagerSchema = hapi.object({
  FirstName: hapi.string().min(3).required(),
  LastName: hapi.string().min(3).required(),
  Email: hapi.string().email().required(),
  Password: hapi.string().min(8).required(),
  isActive: hapi.boolean().required(),
});

const ManagerSchemaPut = hapi.object({
  _id: hapi.string().required().required(),
  FirstName: hapi.string().min(3),
  LastName: hapi.string().min(3),
  Email: hapi.string().email(),
  Password: hapi.string().min(8),
  isActive: hapi.boolean(),
});

const ManagerSchemaLogin = hapi.object({
  Email: hapi.string().email().required(),
  Password: hapi.string().min(8).required(),
});

const ManagerSchemaPassword = hapi.object({
  _id: hapi.string().required(),
  Password: hapi.string().min(8).required(),
});

module.exports = {
  ManagerSchemaPut,
  ManagerSchema,
  ManagerSchemaLogin,
  ManagerSchemaPassword,
};
