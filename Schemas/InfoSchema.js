// This is the info schema to validate the syntax

const hapi = require("@hapi/joi");

const InfoSchemaPut = hapi.object({
  AnnualPrice: hapi.number(),
  MonthlyPrice: hapi.number(),
  Discount: hapi.number(),
});

module.exports = {
  InfoSchemaPut,
};
