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
  },
  { timestamps: true } //this is to add the created_at and updated_at fields
);

const User = mongoose.model("User", userSchema);
module.exports = User;
