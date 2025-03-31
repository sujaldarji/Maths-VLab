const mongoose = require("mongoose");

const VideoContentSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    url: { type: String, required: true },
    thumbnail: { type: String },
    duration: { type: Number }, // Duration in seconds
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VideoContent", VideoContentSchema);
