const express = require("express");
const {
  // getNotifications,
  getNotifications,
  getNewNotifications,
  createNotification,
  getNotificationById,
  updateNotificationLog,
} = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");
const { get } = require("mongoose");

const router = express.Router();

router
  .route("/") // change to get with protection
  .post(protect, createNotification);
router.route("/all").get(protect, getNotifications);
router.route("/new").get(protect, getNewNotifications);
router
  .route("/:id")
  .get(getNotificationById)
  .put(protect, updateNotificationLog);

const socketUpdateNotificationLog = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("updateNotificationLog", (data) => {
      updateNotificationLog(data)
        .then(({ event, res }) => {
          socket.emit(event, res);
          console.log("res", res);
          console.log("event", event);
        })
        .catch((error) => {
          console.error("Error during updateNotificationLog:", error);
        });
      io.emit("update");
    });
  });
};

const socketCreateNotification = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("createNotification", (data) => {
      createNotification(data)
        .then(({ event, res }) => {
          console.log("before");
          socket.emit(event, res);
          console.log("res", res);
          console.log("event", event);
        })
        .catch((error) => {
          console.error("Error during createNotification:", error);
        });

      io.emit("update");
    });
  });
};

module.exports = {
  notificationRoute: router,
  socketUpdateNotificationLog,
  socketCreateNotification,
};
