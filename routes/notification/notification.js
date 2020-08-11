const Notification = require("../../models/NotificationSchema");
const { asyncHandler } = require("../../middlewares/errorHandlers");

let notification = (module.exports = {});

// Add a notification
notification.add = asyncHandler(async (req, res, next) => {
  const newNotification = new Notification(req.body);
  const savedNotification = await newNotification.save();

  res.send(savedNotification);
});

// Get all notifications of a user
notification.getAllNotificationsOfAUser = asyncHandler(
  async (req, res, next) => {
    res.send(res.advancedResults);
  }
);
