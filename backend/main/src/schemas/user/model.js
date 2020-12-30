const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "judge", "admin"],
    default: "user",
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = { User, UserSchema };
