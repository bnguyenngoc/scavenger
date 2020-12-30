const mongoose = require("mongoose");

const TeamChallengeSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
  },
  score: {
    type: Number,
    default: 0,
  },
  submission: String,
  status: {
    type: String,
    enum: ["todo", "wip", "pending", "rework", "done", "abandon"],
    default: "todo",
  },
  isDone: Boolean,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const TeamChallenge = mongoose.model("TeamChallenge", TeamChallengeSchema);

module.exports = TeamChallenge;
