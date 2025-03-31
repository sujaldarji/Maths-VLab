// server/routes/textContentRoutes.js
const express = require("express");
const router = express.Router();
const TextContent = require("../Models/TextContent");

// GET /api/textContent/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const text = await TextContent.findById(id);
    if (!text) {
      return res.status(404).json({ message: "Text content not found" });
    }
    res.json(text);
  } catch (error) {
    console.error("Error fetching text content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/textContent
// Optional if you want to create new text content from the backend
router.post("/", async (req, res) => {
  try {
    const { topicId, content } = req.body;
    const newText = await TextContent.create({ topicId, content });
    res.status(201).json({ message: "Text content created", textContent: newText });
  } catch (error) {
    console.error("Error creating text content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/textContent/:id
// Optional if you want to update existing text content
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const updatedText = await TextContent.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );
    if (!updatedText) {
      return res.status(404).json({ message: "Text content not found" });
    }
    res.json({ message: "Text content updated", textContent: updatedText });
  } catch (error) {
    console.error("Error updating text content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
