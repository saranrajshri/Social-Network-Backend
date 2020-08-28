const bycrypt = require("bcryptjs");
const createError = require("http-errors");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../../config/config.json")[
  process.env.NODE_ENV || "development"
];
let user = (module.exports = {});

// Models
const User = require("../../models/UserSchema");
const Post = require("../../models/PostSchema");

const { asyncHandler } = require("../../middlewares/errorHandlers");

// Validators
const { userRegisterAuth } = require("../../validators/validation");
const { sendNotification } = require("../../utils/utils");
const { post } = require("..");

// Create a new user
user.add = asyncHandler(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  const userDataCopy = { ...req.body };
  userDataCopy.phoneNumber = userDataCopy.phoneNumber.toString();
  userDataCopy.age = userDataCopy.age.toString();

  // Validate User Data
  const validateUser = await userRegisterAuth.validateAsync(userDataCopy);

  // Check user already exists or not
  const doesUserExists = await User.find({ phoneNumber: phoneNumber });

  if (doesUserExists.length !== 0)
    throw createError.Conflict("User Already Exists");

  // Hash Password
  bycrypt.genSalt(10, (err, salt) => {
    bycrypt.hash(password, salt, async (err, hashedPassword) => {
      if (err) throw err;
      req.body.password = hashedPassword;
      // Save the user
      const user = new User(req.body);
      const savedUser = await user.save();

      res.send(savedUser);
    });
  });
});

// User Login
user.login = asyncHandler(async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const err = createError(401, "Incorrect Credentials");
        return next(err);
      }

      req.login(user, { session: false }, async (err) => {
        if (err) next(err);

        const body = { _id: user._id, phoneNumber: user.phoneNumber };

        const token = jwt.sign({ user: body }, config.secret);

        return res.json({ token });
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

user.getTimeLine = asyncHandler(async (req, res, next) => {
  // get the user's friends list
  const userDetails = await User.findOne(
    { _id: req.user._id },
    { following: 1 }
  ).populate("following", "_id");

  const { following } = userDetails;

  // Push the current user ID to the following list inorder to get his posts also in a single fetch.
  following.push({ _id: req.user_id });

  // Get the posts of the user's friends
  var query = Post.find({ user: { $in: following } }).populate("user", "name");

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query.sort(sortBy);
  } else {
    query = query.sort("-time");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.find({ user: { $in: following } }).count();

  query = query.skip(startIndex).limit(limit);

  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.send({
    success: true,
    count: results.length,
    pagination,
    data: results,
  });
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
  const userID = req.user._id;

  if (userID === req.params.userToBeFollowedID) {
    throw createError(422, "You can't follow yourself");
  }

  const user = await User.findOneAndUpdate(
    { _id: userID },
    { $addToSet: { following: req.params.userToBeFollowedID } }
  );

  const userDetails = await User.findOne({ _id: userID }, { name: 1 });

  const userToFollowed = await User.findOneAndUpdate(
    { _id: req.params.userToBeFollowedID },
    { $addToSet: { followers: userID } }
  );

  const updatedUser = await User.findOne({ _id: userID });

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
  const userID = req.user._id;

  if (userID === req.params.userToBeUnFollowedID) {
    throw createError(422, "You cant' follow/unfollow yourself");
  }

  const user = await User.findOneAndUpdate(
    { _id: userID },
    { $pull: { following: req.params.userToBeUnFollowedID } }
  );

  const userToFollowed = await User.findOneAndUpdate(
    { _id: req.params.userToBeUnFollowedID },
    { $pull: { followers: userID } }
  );

  const updatedUser = await User.findOne({ _id: userID });

  res.send(updatedUser);
});

// get posts of user's friend
user.getPosts = asyncHandler(async (req, res, next) => {});
