const mongoose = require("mongoose");

const receiverSchema = mongoose.Schema(
  {
    notificationId: [
      {
        //each language is related to only one user
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
        index: true,
        // read: {
        //   type: Boolean,
        //   default: false
        // },
      },
    ],
  },
  { timestamps: true }
);

const Receiver = mongoose.model("Receiver", receiverSchema);
module.exports = Receiver;
