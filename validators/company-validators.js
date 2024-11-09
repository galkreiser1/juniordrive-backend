const Joi = require("joi");

const createCompanySchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = {
  createCompanySchema,
};
