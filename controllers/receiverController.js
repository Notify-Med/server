const Receiver = require("../models/receiverModel");
const asyncHandler = require("express-async-handler");

//get all notification for the user
//GET "/receiver/notifications/all"
const getAllNotifications = asyncHandler(async (req, res) => {
  const userId = req.body.id;
  const { status, notificationId } = await Receiver.find({ userId });
  res.json({ status, notificationId });
});

module.exports = { getAllNotifications };
