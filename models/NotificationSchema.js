const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  title: String,
  description: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const notification = mongoose.model("Notification", NotificationSchema);
module.exports = notification;
