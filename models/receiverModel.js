const mongoose = require("mongoose");

// const receiverSchema = mongoose.Schema(
//   {
//     notificationId: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Notification",
//         index: true,
//       },
//     ],
//   },
//   { timestamps: true }
// );

const receiverSchema = mongoose.Schema(
  {
    notification: [
      {
        notificationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Notification",
          index: true,
        },
        log: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Receiver = mongoose.model("Receiver", receiverSchema);
module.exports = Receiver;
