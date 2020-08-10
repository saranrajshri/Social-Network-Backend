const express = require("express");
const router = express.Router();

const user = require("./user/user");
const post = require("./post/post");

// User
router.post("/user/add", user.add).get("/getAllUsers", user.getAllUsers);

// Post
router
  .post("/post/add", post.add)
  .get("/post/find/:postID", post.find)
  .post("/post/addLike/:postID/:userID", post.addLike)
  .post("/post/unLike/:postID/:userID", post.unLike)
  .post("/post/addComment", post.addComment)
  .post("/post/removeComment/:postID/:commentID", post.removeComment);

module.exports = router;
