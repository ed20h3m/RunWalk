const hapi = require("@hapi/joi");

const EmailSchema = hapi.object({
  Email: hapi.string().email().required(),
});
module.exports = {
  EmailSchema,
};
