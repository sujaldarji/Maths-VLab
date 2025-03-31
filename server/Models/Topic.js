const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    topicId: { type: String, required: true, unique: true },
    domain: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    section: {
      text: { type: mongoose.Schema.Types.ObjectId, ref: "TextContent" },
      video: { type: mongoose.Schema.Types.ObjectId, ref: "VideoContent" },
      simulation: { type: mongoose.Schema.Types.ObjectId, ref: "SimulationContent" },
      quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
      game: { type: mongoose.Schema.Types.ObjectId, ref: "GameContent" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Topic", topicSchema);
