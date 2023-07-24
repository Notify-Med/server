const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter an email"],
    },
    notifications: {
      // get the id of the document that stores the list of notifications in the receiver collection
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reciever",
      index: true,
    },
  },
  { timestamps: true } //this is to add the created_at and updated_at fields
);

const User = mongoose.model("User", userSchema);
module.exports = User;
