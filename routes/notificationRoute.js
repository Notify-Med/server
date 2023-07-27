const express = require("express");
const {
  getNotifications,
  createNotification,
  getNotificationById,
} = require("../controllers/notificationController");
const {protect}=require('../middlewares/authMiddleware')

const router = express.Router();

router.route("/").get(protect, getNotifications).post(protect, createNotification);
router.route("/:id").get(getNotificationById);

module.exports = router;
