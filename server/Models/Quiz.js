const mongoose = require("mongoose");

const QuizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
});

const QuizSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    questions: [QuizQuestionSchema],
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", QuizSchema);
