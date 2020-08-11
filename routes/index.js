const express = require("express");
const router = express.Router();

const user = require("./user/user");
const post = require("./post/post");
const notification = require("./notification/notification");

const advancedResults = require("../helpers/advancedSearchResults");

// Models
const User = require("../models/UserSchema");
const Notification = require("../models/NotificationSchema");

// User Routes
router
  .post("/user/add", user.add)
  .get(
    "/user/getAllUsers",
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
  .get("/user/find/:userID", user.find)
  .post("/user/follow/:userID/:userToBeFollowedID", user.followUser)
  .post("/user/unfollow/:userID/:userToBeUnFollowedID", user.unFollowUser);

// Post (Blog Post) Routes
router
  .post("/post/add", post.add)
  .get("/post/find/:postID", post.find)
  .post("/post/addLike/:postID/:userID", post.addLike)
  .post("/post/unLike/:postID/:userID", post.unLike)
  .post("/post/addComment", post.addComment)
  .post("/post/removeComment/:postID/:commentID", post.removeComment);

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
