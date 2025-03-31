const express = require("express");
const router = express.Router();
const VideoContent = require("../Models/VideoContent");

// GET /api/videoContent/:id
// Retrieve a video content document by its ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const video = await VideoContent.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video content not found" });
    }
    res.json(video);
  } catch (error) {
    console.error("Error fetching video content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/videoContent
// Create new video content
router.post("/", async (req, res) => {
  try {
    const { topicId, url, thumbnail, duration, description } = req.body;
    
    // Basic validation: Ensure URL and topicId are provided
    if (!topicId || !url) {
      return res.status(400).json({ message: "topicId and url are required." });
    }
    
    const newVideoContent = await VideoContent.create({
      topicId,
      url,
      thumbnail,
      duration,
      description,
    });
    
    res.status(201).json({
      message: "Video content created successfully",
      videoContent: newVideoContent,
    });
  } catch (error) {
    console.error("Error creating video content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/videoContent/:id
// Update existing video content by its ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { url, thumbnail, duration, description } = req.body;
    
    const updatedVideoContent = await VideoContent.findByIdAndUpdate(
      id,
      { url, thumbnail, duration, description },
      { new: true }
    );
    
    if (!updatedVideoContent) {
      return res.status(404).json({ message: "Video content not found" });
    }
    
    res.json({
      message: "Video content updated successfully",
      videoContent: updatedVideoContent,
    });
  } catch (error) {
    console.error("Error updating video content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/videoContent/:id
// Delete video content by its ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVideoContent = await VideoContent.findByIdAndDelete(id);
    
    if (!deletedVideoContent) {
      return res.status(404).json({ message: "Video content not found" });
    }
    
    res.json({ message: "Video content deleted successfully" });
  } catch (error) {
    console.error("Error deleting video content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
