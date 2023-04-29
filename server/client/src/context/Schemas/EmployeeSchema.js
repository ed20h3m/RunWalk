// This is the employee schema to validate the syntax

const hapi = require("@hapi/joi");

const EmployeeSchema = hapi.object({
  FirstName: hapi.string().min(3).required(),
  LastName: hapi.string().min(3).required(),
  Email: hapi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
  Password: hapi.string().min(8).required(),
  isSuspended: hapi.boolean().required(),
});

const EmployeeSchemaPut = hapi.object({
  _id: hapi.string().required(),
  FirstName: hapi.string().min(3),
  LastName: hapi.string().min(3),
  Email: hapi.string().email({ tlds: { allow: false } }),
  Password: hapi.string().min(8),
  isSuspended: hapi.boolean(),
});

const EmployeeSchemaLogin = hapi.object({
  Email: hapi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
  Password: hapi.string().min(8).required(),
});
module.exports = {
  EmployeeSchemaLogin,
  EmployeeSchema,
  EmployeeSchemaPut,
};
