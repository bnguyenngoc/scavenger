const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 4,
  },
  text: {
    type: String,
    minlength: 4,
  },
  judgeNote: {
    type: String,
  },
  score: {
    type: Number,
    min: 1,
  },
  keyword: [String],
  published: Boolean,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  type: {
    type: String,
    enum: ["flag", "text", "picture", "video", "live", "url", "file"],
    default: "text",
  },
});

const Challenge = mongoose.model("Challenge", ChallengeSchema);

module.exports = Challenge;
