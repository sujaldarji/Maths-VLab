const express = require("express");
const router = express.Router();
const Progress = require("../Models/Progress");

// GET /api/progress/:userId
// Retrieve all progress records for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const progressRecords = await Progress.find({ user: userId }).populate("completedTopics.topicId");
    if (!progressRecords) {
      return res.status(404).json({ message: "No progress records found for this user" });
    }
    res.json(progressRecords);
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/progress/:userId/:topicId
// Create a new progress record for a user and topic
router.post("/:userId/:topicId", async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const { completedSection } = req.body;
    
    // Check if a progress record for this topic already exists for the user
    const existingRecord = await Progress.findOne({ user: userId, "completedTopics.topicId": topicId });
    if (existingRecord) {
      return res.status(400).json({ message: "Progress record already exists for this topic" });
    }
    
    const newProgress = await Progress.create({
      user: userId,
      completedTopics: [{
        topicId: topicId,
        completedSection
      }]
    });
    res.status(201).json({ message: "Progress record created successfully", progress: newProgress });
  } catch (error) {
    console.error("Error creating progress record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/progress/:userId/:topicId
// Update an existing progress record for a user on a specific topic
router.put("/:userId/:topicId", async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const { completedSection } = req.body;
    
    const progressRecord = await Progress.findOneAndUpdate(
      { user: userId, "completedTopics.topicId": topicId },
      { $set: { "completedTopics.$.completedSection": completedSection } },
      { new: true }
    );
    
    if (!progressRecord) {
      return res.status(404).json({ message: "Progress record not found" });
    }
    
    res.json({ message: "Progress record updated successfully", progress: progressRecord });
  } catch (error) {
    console.error("Error updating progress record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/progress/:userId/:topicId
// Optionally, delete a progress record for a user on a specific topic
router.delete("/:userId/:topicId", async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const deleted = await Progress.findOneAndUpdate(
      { user: userId },
      { $pull: { completedTopics: { topicId: topicId } } },
      { new: true }
    );
    if (!deleted) {
      return res.status(404).json({ message: "Progress record not found" });
    }
    res.json({ message: "Progress record deleted successfully", progress: deleted });
  } catch (error) {
    console.error("Error deleting progress record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
