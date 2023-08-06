const Notification = require("../models/notificationModel");
const asyncHandler = require("express-async-handler");
const Receiver = require("../models/receiverModel");
const ObjectId = require("mongoose").Types.ObjectId;
const User = require("../models/userModel");

//get all notifications
//GET "/notifications/all"

// const getNotifications = asyncHandler(async (req, res) => {
//   console.log("user ", req.user.id);
//   const usersNotifs = await Receiver.findById(req.user.id).populate({
//     path: "notificationId",
//     populate: {
//       path: "senderId",
//       model: "User", // Reference to the User model
//       select: "name", // Assuming "name" is the field in the User model that contains the sender's name
//     },
//   });

//   if (!usersNotifs) {
//     res.json("the user has no notifications !");
//   } else {
//     // Map the notifications to extract the sender's name and create a new array
//     const notifications = usersNotifs.notificationId.map((notification) => {
//       return {
//         title: notification.title,
//         description: notification.description,
//         date: notification.date.toLocaleString(),
//         sender: notification.senderId.name, // Access the sender's name via the populated "senderId"
//       };
//     });

//     res.json(notifications.reverse());
//   }
// });

const getNotifs = asyncHandler(async (type, req, res) => {
  try {
    let usersNotifs;
    const receiver = await Receiver.findById(req.user.id);
    if (type === "all") {
      usersNotifs = await receiver.populate(
        "notification.notificationId" // Correct the population path
      );
      usersNotifs = usersNotifs.notification;
    } else {
      usersNotifs = await receiver.populate(
        "notification.notificationId" // Correct the population path
      );
      console.log("usersNotifs: ", usersNotifs);
      usersNotifs = usersNotifs.notification.filter(
        (notif) => notif.log === false
      );
    }

    if (!usersNotifs) {
      return res.json("The user has no notifications!");
    }
    console.log("usernotifs: ", usersNotifs);

    // Map the notifications to extract the sender's name and create a new array
    const notifications = usersNotifs.map((notificationEntry) => {
      const notification = notificationEntry.notificationId;
      return {
        id: notification._id,
        title: notification.title,
        description: notification.description,
        date: notification.createdAt.toLocaleString(),
        sender: notification.senderId.name, // Access the sender's name via the populated "senderId"
        log: notificationEntry.log,
      };
    });

    res.json(notifications.reverse());
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getNotifications = asyncHandler(async (req, res) => {
  getNotifs("all", req, res);
});

const getNewNotifications = asyncHandler(async (req, res) => {
  getNotifs("new", req, res);
});

const updateNotificationLog = asyncHandler(async (req, res) => {
  try {
    const { log } = req.body;
    const notifId = req.params.id;
    const receiverId = req.user.id;

    // Find the receiver document by ID
    const receiver = await Receiver.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    // Find the notification within the receiver's notifications array
    const notificationToUpdate = receiver.notification.find(
      (notif) => notif.notificationId == notifId
    );

    if (!notificationToUpdate) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Update the log property of the notification
    notificationToUpdate.log = log;

    // Save the changes to the receiver document
    await receiver.save();

    res.json({ message: "Notification log updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred" });
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
  getNotifications,
  getNewNotifications,
  createNotification,
  getNotificationById,
  updateNotificationLog,
};
