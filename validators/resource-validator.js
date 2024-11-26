const Joi = require("joi");

const resourceSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid("PLATFORM", "COMMUNITY", "GUIDE").required(),
  description: Joi.string().allow(""),
  link: Joi.string().required(),
});

module.exports = {
  resourceSchema,
};
