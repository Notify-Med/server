const express = require("express");
const {
  getAllNotifications,
  createNotification,
  getNotificationById,
} = require("../controllers/notificationController");

const router = express.Router();

router.route("/").get(getAllNotifications).post(createNotification);
router.route("/:id").get(getNotificationById);

module.exports = router;
