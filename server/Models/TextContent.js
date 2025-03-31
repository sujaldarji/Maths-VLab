const mongoose = require("mongoose");

const TextContentSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    content: { type: String, required: true }, // This can store large text or HTML content
  },
  { timestamps: true }
);

module.exports = mongoose.model("TextContent", TextContentSchema);
