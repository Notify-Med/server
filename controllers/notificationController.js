const Notification = require("../models/notificationModel");
const asyncHandler = require("express-async-handler");
const Receiver = require("../models/receiverModel");

//get all notifications
//GET "/notifications/all"
const getNotifications = asyncHandler(async (req, res) => {
  const usersNotifs = await Receiver.findById(req.user.id);
  res.json(usersNotifs.notificationId);
  if (!usersNotifs) {
    console.log('the user has no notifications !');
    // if we do not find any document with the id of the user in the receiver collection, 
    // this means that the user doesn't have any notifications
  }
  
});

//create a notification
const createNotification = asyncHandler(async (req, res) => {
  const { title, description, date, senderId, receiverId } = req.body;
  const notification = new Notification({
    title,
    description,
    date,
    senderId,
    receiverId,
  });
  const createdNotification = await notification.save();
  res.status(201).json(createdNotification);
});

//get a notification by id
const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (notification) {
    res.json(notification);
  } else {
    res.status(404);
    throw new Error("Notification not found");
  }
});

module.exports = {
  getNotifications,
  createNotification,
  getNotificationById,
};
