let user = (module.exports = {});
const createError = require("http-errors");

// Models
const User = require("../../models/UserSchema");

user.add = async (req, res, next) => {
  const { phoneNumber } = req.body;
  try {
    const doesUserExists = await User.find({ phoneNumber: phoneNumber });

    if (doesUserExists.length !== 0)
      throw createError.Conflict("User Already Exists");

    const user = new User(req.body);
    const savedUser = await user.save();

    res.send(savedUser);
  } catch (err) {
    next(err);
  }
};

user.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { __v: 0 });
    res.send(users);
  } catch (err) {
    next(err);
  }
};
