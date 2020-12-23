const mongoose = require("mongoose");
const { UserSchema } = require("../user/model");

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  tagline: String,
  url: String,
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
