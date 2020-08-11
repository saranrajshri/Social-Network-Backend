const Post = require("../../models/PostSchema");
const Comment = require("../../models/CommentSchema");
const createError = require("http-errors");
const { asyncHandler } = require("../../middlewares/errorHandlers");
const { addPostAuth, addCommentAuth } = require("../../validators/validation");

let post = (module.exports = {});

// Add a new post
post.add = asyncHandler(async (req, res, next) => {
  // Validate Incoming Data
  const validate = await addPostAuth.validateAsync(req.body);

  // Save the data
  const newPost = new Post(req.body);
  const savedPost = await newPost.save();

  res.send(savedPost);
});

// Find a post by _id
post.find = asyncHandler(async (req, res, next) => {
  const foundPost = await Post.findOne({ _id: req.params.postID })
    .populate(
      "likes",
      "name" // Select the field to be populated
    )
    .populate({
      path: "comments",
      select: "user comment",
      populate: { path: "user", model: "User", select: "name" }, // nested populate
    });
  if (!foundPost) {
    throw createError(206, "No Data Found"); // find a better method for this
  }
  res.send(foundPost);
});

// Add like to a post
post.addLike = asyncHandler(async (req, res, next) => {
  const postToBeModified = await Post.findOneAndUpdate(
    { _id: req.params.postID },
    { $addToSet: { likes: req.params.userID } }
  );
  const updatedPost = await Post.findOne({ _id: req.params.postID });
  res.send(updatedPost);
});

// Remove like from a post
post.unLike = asyncHandler(async (req, res, next) => {
  const postToBeModified = await Post.findOneAndUpdate(
    { _id: req.params.postID },
    { $pull: { likes: req.params.userID } }
  );

  const updatedPost = await Post.findOne({ _id: req.params.postID });
  res.send(updatedPost);
});

// Add comment to a post
post.addComment = asyncHandler(async (req, res, next) => {
  const { post } = req.body;

  // Validate Incoming Data
  const validate = addCommentAuth.validateAsync(req.body);

  // Add a document to the comments collection
  const comment = new Comment(req.body);
  const savedComment = await comment.save();

  const { _id } = savedComment; // get the comment ID

  // Add the comment document id to the comments array in posts collection
  const postToBeModified = await Post.findOneAndUpdate(
    {
      _id: post,
    },
    { $push: { comments: _id } }
  );

  const updatedPost = await Post.findOne({ _id: post });
  res.send(updatedPost);
});

// Remove a comment from a post
post.removeComment = asyncHandler(async (req, res, next) => {
  // Remove the comment document id to the comments array in posts collection
  var updatedPost = await Post.findOneAndUpdate(
    ({ _id: req.params.postID }, { $pull: { comments: req.params.commentID } })
  );

  // Delete the document to the comments collection
  const removedComment = await Comment.findByIdAndRemove({
    _id: req.params.commentID,
  });

  updatedPost = await Post.findOne({ _id: req.params.postID });
  res.send(updatedPost);
});
