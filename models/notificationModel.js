const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["general", "alert"],
      default: "general",
    },
    date: {
      type: Date,
      default: new Date(),
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      //required: true,
      ref: "User",
      index: true,
    },
    receiversId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Receiver",
        index: true,
      },
    ],
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
