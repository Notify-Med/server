const mongoose = require("mongoose");
const Receiver = require("./receiverModel");

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
    senderEmail: {
      type: String,
      // required: true,
    },
    receiverId: [
      {
        //each language is related to only one user
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: "User",
        index: true,
      },
    ],
  },
  { timestamps: true }
);

// notificationSchema.post('save',async function(){
//   let receiverId=String(this.receiverId) ;
//   await  Receiver.create(receiverId)
//   await  Receiver.findByIdAndUpdate({_id : receiverId},{$push :{notificationId: this._id}})
// })

notificationSchema.post("save", async function () {
  // Loop through each receiverId in the array
  for (const receiverId of this.receiverId) {
    try {
      await Receiver.findOneAndUpdate(
        { _id: receiverId },
        { $push: { notificationId: this._id } },
        { upsert: true } // This option creates the document if it doesn't exist
      );
    } catch (error) {
      console.error("Error in notificationSchema post-save middleware:", error);
    }
  }
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
