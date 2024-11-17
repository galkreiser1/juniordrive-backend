const Joi = require("joi");

const createRefererSchema = Joi.object({
  company: Joi.string().required(),
  name: Joi.string().required(),
  numReferrals: Joi.number().integer().min(0),
  role: Joi.string().required(),
  location: Joi.string(),
  email: Joi.string().email().required(),
  linkedin: Joi.string().allow(""),
  availability: Joi.string().valid("Available", "Unavailable"),
});

module.exports = {
  createRefererSchema,
};
