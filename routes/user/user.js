let user = (module.exports = {});
const createError = require("http-errors");

// Models
const User = require("../../models/UserSchema");
const { asyncHandler } = require("../../middlewares/errorHandlers");

// Validators
const { userRegisterAuth } = require("../../validators/validation");
const { sendNotification } = require("../../utils/utils");

// Create a new user
user.add = asyncHandler(async (req, res, next) => {
  const { phoneNumber } = req.body;

  const userDataCopy = { ...req.body };
  userDataCopy.phoneNumber = userDataCopy.phoneNumber.toString();

  // Validate User Data
  const validateUser = await userRegisterAuth.validateAsync(userDataCopy);

  // Check user already exists or not
  const doesUserExists = await User.find({ phoneNumber: phoneNumber });

  if (doesUserExists.length !== 0)
    throw createError.Conflict("User Already Exists");

  // Save the user
  const user = new User(req.body);
  const savedUser = await user.save();

  res.send(savedUser);
});

// Get all user details
user.getAllUsers = asyncHandler(async (req, res, next) => {
  // The results are coming from advancedResults middleware
  // Refer the file helpers/advancedSearchResults.js
  res.send(res.advancedResults);
});

// Find a user by _id
user.find = asyncHandler(async (req, res, next) => {
  // Get User Details
  const foundUser = await User.findOne({ _id: req.params.userID })
    .populate("following", "name")
    .populate("followers", "name");

  res.send(foundUser);
});

// Follow  a user
user.followUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.userID },
    { $addToSet: { following: req.params.userToBeFollowedID } }
  );

  const userDetails = await User.findOne(
    { _id: req.params.userID },
    { name: 1 }
  );

  const userToFollowed = await User.findOneAndUpdate(
    { _id: req.params.userToBeFollowedID },
    { $addToSet: { followers: req.params.userID } }
  );

  const updatedUser = await User.findOne({ _id: req.params.userID });

  // Send notification to the other user
  let notificationDataToBeSent = {
    title: `${userDetails.name} has follwed you`,
    // description: "One new user has followed you", //optional field
    user: req.params.userToBeFollowedID,
  };

  sendNotification(notificationDataToBeSent); // returns boolean

  res.send(updatedUser);
});

// Unfollow a user
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
