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
    const receiver = await Receiver.findById(req.user.id);

    if (!receiver) {
      return res.json("User not found or has no notifications");
    }

    let usersNotifs;

    if (type === "all") {
      usersNotifs = await receiver.populate("notification.notificationId");
      usersNotifs = usersNotifs.notification;
    } else {
      usersNotifs = await receiver.populate("notification.notificationId");
      usersNotifs = usersNotifs.notification.filter((notif) => notif.log === false);
    }

    if (!usersNotifs || usersNotifs.length === 0) {
      return res.json("The user has no notifications!");
    }

    if (!usersNotifs) {
      return res.json("The user has no notifications!");
    }

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

const updateNotificationLog = asyncHandler(async (data) => {
  try {
    const { receiverId, notifId } = data;
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
    notificationToUpdate.log = true;

    // Save the changes to the receiver document
    await receiver.save();
    return {
      event: "notificationLogUpdated",
      res: "Notification log updated successfully",
    };
  } catch (err) {
    console.log(err);
    return { event: "notificationLogUpdated", res: "An error occurred" };
  }
});

const getSentNotifications = asyncHandler(async (req, res) => {
  try {
    let notifications = await Notification.find({
      senderId: req.user.id,
    });
    //   res.json(notifications.reverse()); //send notifications:
    // [
    // {
    //     "_id": "64d0b83ec7e030909ac6dbd9",
    //     "title": "bgzrgz",
    //     "description": "bzrgbzr",
    //     "date": "2023-08-07T09:22:44.362Z",
    //     "senderId": "64cfacf9d817339628da61c8",
    //     "receiverId": [
    //         "64cfacf9d817339628da61c8"
    //     ],
    //     "createdAt": "2023-08-07T09:24:14.873Z",
    //     "updatedAt": "2023-08-07T09:24:14.873Z",
    //     "__v": 0
    // },
    // ]

    notifications = await Promise.all(
      notifications.map(async (notification) => {
        const receiverId = await Promise.all(
          notification.receiverId.map(async (receiverId) => {
            const receiverName = await User.findById(receiverId);
            const receiver = await Receiver.findById(receiverId);
            console.log("target notif id", notification._id);
            const getMatchedNotif = () => {
              for (const notif of receiver.notification) {
                if (
                  notif.notificationId.toString() == notification._id.toString()
                ) {
                  return notif;
                }
              }
            };
            const notificationO = getMatchedNotif();
            // const notificationO = receiver.notification.map((notif) => {
            //   console.log("notif id", notif.notificationId);
            //   if (
            //     notif.notificationId.toString() == notification._id.toString()
            //   ) {
            //     return notif;
            //   }
            // });
            const res = {
              name: receiverName.name,
              // log: notificationO.log,
              log: notificationO.log,
            };

            return res;
          })
        );
        return {
          ...notification._doc,
          receivers: receiverId,
        };
      })
    );
    res.json(notifications.reverse());

    // if (!notifications) {
    //   return res.json("The user has no notifications!");
    // }

    // console.log("notifications", notifications[0]);
    // res.json(notifications.reverse());
    // console.log("notification0", notifications[0].receiverId[0].notification);

    // Map the notifications to extract the sender's name and create a new array

    // const sentNotifications = notifications.map((notification) => {
    //   return {
    //     title: notification.title,
    //     description: notification.description,
    //     date: notification.date.toLocaleString(),
    //     receivers: notification.receiverId.map((receiver) =>
    //     {
    //       name: User.findById(receiver).name,
    //        log: Receiver.findById(receiver).notification.find((notif) => notif.notificationId == notification._id).log}),
    //   };
    // });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
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
// const getNotificationById = asyncHandler(async (req, res) => {
//   const notification = await Notification.findById(req.params.id);
//   if (notification) {
//     res.json(notification);
//   } else {
//     res.status(404);
//     throw new Error("Notification not found");
//   }
// });

module.exports = {
  getNotifications,
  getNewNotifications,
  createNotification,
  getSentNotifications,
  // getNotificationById,
  updateNotificationLog,
};
