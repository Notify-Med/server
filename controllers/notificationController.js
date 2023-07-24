const Notification = require("../models/notificationModel");
const Receiver = require("../models/receiverModel");
const asyncHandler = require("express-async-handler");

//get all notifications
//GET "/notifications/all"
const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({});

  res.json(notifications);
});

//create a notification
const createNotification = asyncHandler(async (req, res) => {
  const { title, description, date, senderId, receiverId } = req.body; //should implement receiversId as an array of ids
  console.log(receiverId);

  const notification = new Notification({
    title,
    description,
    date,
    senderId,
    receiverId,
  });
  const createdNotification = await notification.save();

  const receiver = await Receiver.findById(receiverId);
  if (receiver) {
    receiver.notificationId.push(createdNotification._id);
    receiver.status.push(false);
    await receiver.save();
  }

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
  getAllNotifications,
  createNotification,
  getNotificationById,
};
