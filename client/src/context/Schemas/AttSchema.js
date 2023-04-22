const hapi = require("@hapi/joi");

const EmailSchema = hapi.object({
  Email: hapi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
});
const PasswordSchema = hapi.object({
  Password: hapi.string().min(8).required(),
});
module.exports = {
  EmailSchema,
  PasswordSchema,
};
