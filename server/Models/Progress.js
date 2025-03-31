const mongoose = require("mongoose");

const CompletedSectionSchema = new mongoose.Schema({
  text: { type: Boolean, default: false },
  video: { type: Boolean, default: false },
  quizScore: { type: Number, default: 0 },
  lastVisited: { type: Date, default: Date.now },
});

const UserProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    completedTopics: [
      {
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
        completedSection: CompletedSectionSchema,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", UserProgressSchema);
