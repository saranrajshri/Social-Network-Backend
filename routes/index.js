const express = require("express");
const router = express.Router();
const passport = require("passport");
const user = require("./user/user");
const post = require("./post/post");
const notification = require("./notification/notification");

const advancedResults = require("../helpers/advancedSearchResults");

// Models
const User = require("../models/UserSchema");
const Notification = require("../models/NotificationSchema");

const ensureAuthenticated = passport.authenticate("jwt", { session: false });

// User Routes
router
  .post("/user/add", user.add)
  .post("/user/login", user.login)
  .get("/user/getPosts", ensureAuthenticated, user.getPosts)
  .get("/user/getTimeLine", ensureAuthenticated, user.getTimeLine)
  .get(
    "/user/getAllUsers",
    ensureAuthenticated,
    advancedResults(User, [
      {
        path: "following",
        select: "name",
      },
      {
        path: "followers",
        select: "name",
      },
    ]),
    user.getAllUsers
  )
  .get("/user/find/:userID", ensureAuthenticated, user.find)
  .post(
    "/user/follow/:userToBeFollowedID",
    ensureAuthenticated,
    user.followUser
  )
  .post(
    "/user/unfollow/:userToBeUnFollowedID",
    ensureAuthenticated,
    user.unFollowUser
  );

// Post (Blog Post) Routes
router
  .post("/post/add", ensureAuthenticated, post.add)
  .get("/post/find/:postID", post.find)
  .post("/post/addLike/:postID", ensureAuthenticated, post.addLike)
  .post("/post/unLike/:postID", ensureAuthenticated, post.unLike)
  .post("/post/addComment", ensureAuthenticated, post.addComment)
  .post(
    "/post/removeComment/:postID/:commentID",
    ensureAuthenticated,
    post.removeComment
  );

// Notification Routes
router.post("/notification/add", notification.add).get(
  "/notification/getAllNotificationsOfAUser/:userID",
  advancedResults(Notification, {
    path: "user",
    select: "name",
  }),
  notification.getAllNotificationsOfAUser
);
module.exports = router;
