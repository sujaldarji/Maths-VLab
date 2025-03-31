const mongoose = require("mongoose");

const GameContentSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    url: { type: String, required: true }, // URL or embed link for the game content
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GameContent", GameContentSchema);
