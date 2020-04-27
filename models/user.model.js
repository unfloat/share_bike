const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Please add your Username."],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Please add your E-mail."],
    },
    password: {
      type: String,
      required: [true, "Password Required"],
    },
    avatar: {
      type: String
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('users', UserSchema);
