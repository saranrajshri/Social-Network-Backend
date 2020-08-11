let user = (module.exports = {});
const createError = require("http-errors");

// Models
const User = require("../../models/UserSchema");
const { asyncHandler } = require("../../middlewares/errorHandlers");

user.add = asyncHandler(async (req, res, next) => {
  const { phoneNumber } = req.body;
  const doesUserExists = await User.find({ phoneNumber: phoneNumber });

  if (doesUserExists.length !== 0)
    throw createError.Conflict("User Already Exists");

  const user = new User(req.body);
  const savedUser = await user.save();

  res.send(savedUser);
});

user.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({}, { __v: 0 });
  res.send(users);
});

user.find = asyncHandler(async (req, res, next) => {
  const foundUser = await User.findOne({ _id: req.params.userID })
    .populate("following", "name")
    .populate("followers", "name");

  res.send(foundUser);
});

user.followUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.userID },
    { $addToSet: { following: req.params.userToBeFollowedID } }
  );

  const userToFollowed = await User.findOneAndUpdate(
    { _id: req.params.userToBeFollowedID },
    { $addToSet: { followers: req.params.userID } }
  );

  const updatedUser = await User.findOne({ _id: req.params.userID });

  res.send(updatedUser);
});

user.unFollowUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.userID },
    { $pull: { following: req.params.userToBeUnFollowedID } }
  );

  const userToFollowed = await User.findOneAndUpdate(
    { _id: req.params.userToBeUnFollowedID },
    { $pull: { followers: req.params.userID } }
  );

  const updatedUser = await User.findOne({ _id: req.params.userID });

  res.send(updatedUser);
});
