// This is the customer schema to validate the syntax

import hapi from "@hapi/joi";

export const CustomerSchema = hapi.object({
  _id: hapi.string(),
  FirstName: hapi.string().min(3).required(),
  LastName: hapi.string().min(3).required(),
  Email: hapi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
  Password: hapi.string().min(8).required(),
  isMember: hapi.boolean().required(),
  subId: hapi.string().allow("").required(),
});
export const CustomerSchemaPut = hapi.object({
  _id: hapi.string().required(),
  FirstName: hapi.string().min(3),
  LastName: hapi.string().min(3),
  Email: hapi.string().email({ tlds: { allow: false } }),
  Password: hapi.string().min(8),
  isMember: hapi.boolean(),
  subId: hapi.string().allow(""),
});

export const CustomerSchemaLogin = hapi.object({
  Email: hapi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
  Password: hapi.string().min(8).required(),
});
export const CustomerSchemaPassword = hapi.object({
  _id: hapi.string().required(),
  Password: hapi.string().min(8).required(),
});
