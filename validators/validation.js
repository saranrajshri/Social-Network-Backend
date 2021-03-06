const Joi = require("@hapi/joi");

// User Validation
const userRegisterAuth = Joi.object({
  name: Joi.string().min(1).required(),
  phoneNumber: Joi.string().length(10).required(),
  age: Joi.string().min(1).required(),
  password: Joi.string().min(6).required(),
});

// Post Validation
const addPostAuth = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
  user: Joi.string().required(),
});

// Comment Validation
const addCommentAuth = Joi.object({
  post: Joi.string().required(),
  user: Joi.string().required(),
  comment: Joi.string().min(1).required(),
});

// Notification Validation
const addNotificationAuth = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().min(1),
  user: Joi.string().required(),
});

module.exports = {
  userRegisterAuth,
  addPostAuth,
  addCommentAuth,
  addNotificationAuth,
};
