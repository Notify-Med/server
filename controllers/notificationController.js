const Notification = require("../models/notificationModel");
const Receiver = require("../models/receiverModel");
const asyncHandler = require("express-async-handler");
const ObjectId = require("mongoose").Types.ObjectId;

//get all notifications
//GET "/notifications/"
const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({});

  res.json(notifications);
});

//create a notification
//POST "/notifications/"
const createNotification = asyncHandler(async (req, res) => {
  const { title, description, date, senderId, receiversId } = req.body; //should implement receiversId as an array of ids
  console.log(receiversId);
  for (let i = 0; i < receiversId.length; i++) {
    receiversId[i] = new ObjectId(receiversId[i]);
  }

  const notification = new Notification({
    title,
    description,
    date,
    senderId,
    receiversId,
  });
  const createdNotification = await notification.save();

  for (const receiverId of receiversId) {
    console.log(receiverId);
    const receiver = await Receiver.findById(receiverId);
    if (receiver) {
      receiver.notificationId.push(createdNotification._id);
      receiver.status.push(false);
      await receiver.save();
    }
  }
  res.status(201).json(createdNotification);
});

//get a notification by id
//GET "/notifications/:id"
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
