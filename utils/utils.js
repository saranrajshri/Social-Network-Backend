const Notification = require("../models/NotificationSchema");
const { addNotificationAuth } = require("../validators/validation");

const sendNotification = async (data) => {
  try {
    // Validate incoming data
    const validate = await addNotificationAuth.validateAsync(data);

    // Save the data
    const newNotification = new Notification(data);
    const savedNotification = await newNotification.save();
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  sendNotification,
};
