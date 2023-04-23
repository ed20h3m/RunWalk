const hapi = require("@hapi/joi");

const TransactionSchema = hapi.object({
  Email: hapi.string().email().required(),
  Items: hapi.array().required(),
});

module.exports = {
  TransactionSchema,
};
