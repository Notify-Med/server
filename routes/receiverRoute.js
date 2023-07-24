const express = require("express");
const { getAllNotifications } = require("../controllers/receiverController");

const router = express.Router();

router.route("/notifications/all").post(getAllNotifications);

module.exports = router;
