const Notification = require("../models/notificationModel");
const asyncHandler = require("express-async-handler");
const Receiver = require("../models/receiverModel");
const ObjectId = require("mongoose").Types.ObjectId;
const User = require("../models/userModel");

//get all notifications
//GET "/notifications/all"

const getNotificationsAxios = asyncHandler(async (req, res) => {
  console.log("user axios", req.user.id);
  const usersNotifs = await Receiver.findById(req.user.id).populate(
    "notificationId"
  );
  if (!usersNotifs) {
    res.json("the user has no notifications !");
    // if we do not find any document with the id of the user in the receiver collection,
    // this means that the user doesn't have any notifications
  } else {
    res.json(usersNotifs.notificationId);
  }
});

const createNotification = async (data) => {
  try {
    // console.log("data", data);
    const { title, description, date, receivers, id } = data;

    // console.log(receivers);
    // console.log("user", id);

    let receiverIds = [];

    for (let i = 0; i < receivers.length; i++) {
      const user = await User.findOne({ email: receivers[i] });
      if (user) {
        receiverIds.push(user._id);
      }
    }

    // console.log("receivers", receivers);

    const notification = new Notification({
      title,
      description,
      date,
      senderId: id,
      receiverId: receiverIds,
    });

    const createdNotification = await notification.save();
    console.log("createdNotification", createdNotification);
    return { event: "notificationCreated", res: createdNotification };
  } catch (error) {
    console.error("Error while creating notification:", error);
    return {
      event: "notificationCreated",
      res: "Error creating notification",
    };
  }
};

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
  getNotificationsAxios,
  createNotification,
  getNotificationById,
};
