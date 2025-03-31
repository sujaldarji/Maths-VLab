const express = require("express");
const router = express.Router();
const Topic = require("../Models/Topic");

// GET /api/topics/:topicId
// Retrieve a single container with all content for a topic
router.get("/:topicId", async (req, res) => {
  try {
    const { topicId } = req.params;
    const topic = await Topic.findOne({ topicId });

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(topic);
  } catch (error) {
    console.error("Error fetching topic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
