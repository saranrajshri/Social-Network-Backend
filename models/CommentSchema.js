const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comment: String,
  time: {
    type: Date,
    default: Date.now,
  },
});
const comment = mongoose.model("Comment", CommentSchema);
module.exports = comment;
