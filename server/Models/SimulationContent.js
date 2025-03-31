const mongoose = require("mongoose");

const SimulationContentSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    embedUrl: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SimulationContent", SimulationContentSchema);
