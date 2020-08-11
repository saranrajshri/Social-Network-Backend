const Joi = require("@hapi/joi");

const userRegisterAuth = Joi.object({
  name: Joi.string().required(),
  phoneNumber: Joi.string().length(10).required(),
  age: Joi.string().required(),
});

module.exports = {
  userRegisterAuth,
};
