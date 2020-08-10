const Post = require("../../models/PostSchema");
const Comment = require("../../models/CommentSchema");
const createError = require("http-errors");

let post = (module.exports = {});

post.add = async (req, res, next) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();

    res.send(savedPost);
  } catch (err) {
    next(err);
  }
};

post.find = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

post.addLike = async (req, res, next) => {
  try {
    const postToBeModified = await Post.findOneAndUpdate(
      { _id: req.params.postID },
      { $addToSet: { likes: req.params.userID } }
    );
    const updatedPost = await Post.findOne({ _id: req.params.postID });
    res.send(updatedPost);
  } catch (err) {
    next(err);
  }
};

post.unLike = async (req, res, next) => {
  try {
    const postToBeModified = await Post.findOneAndUpdate(
      { _id: req.params.postID },
      { $pull: { likes: req.params.userID } }
    );
    const updatedPost = await Post.findOne({ _id: req.params.postID });
    res.send(updatedPost);
  } catch (err) {
    next(err);
  }
};

post.addComment = async (req, res, next) => {
  try {
    const { post } = req.body;

    const comment = new Comment(req.body);
    const savedComment = await comment.save();

    const { _id } = savedComment; // get the comment ID

    const postToBeModified = await Post.findOneAndUpdate(
      {
        _id: post,
      },
      { $push: { comments: _id } }
    );

    const updatedPost = await Post.findOne({ _id: post });
    res.send(updatedPost);
  } catch (err) {
    next(err);
  }
};

post.removeComment = async (req, res, next) => {
  try {
    var updatedPost = await Post.findOneAndUpdate(
      ({ _id: req.params.postID },
      { $pull: { comments: req.params.commentID } })
    );

    const removedComment = await Comment.findByIdAndRemove({
      _id: req.params.commentID,
    });

    updatedPost = await Post.findOne({ _id: req.params.postID });
    res.send(updatedPost);
  } catch (err) {
    next(err);
  }
};
