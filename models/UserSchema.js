const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  phoneNumber: Number,
  age: Number,
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

var user = mongoose.model("User", UserSchema);
module.exports = user;
