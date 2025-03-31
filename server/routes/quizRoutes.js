const express = require("express");
const router = express.Router();
const Quiz = require("../Models/Quiz");

// GET /api/quiz/:id
// Retrieve quiz data by its ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/quiz
// Create a new quiz document
router.post("/", async (req, res) => {
  try {
    const { topicId, questions, score } = req.body;
    const newQuiz = await Quiz.create({ topicId, questions, score });
    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/quiz/:id
// Update an existing quiz document by its ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { questions, score } = req.body;
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { questions, score },
      { new: true }
    );
    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "Quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/quiz/:id
// Delete a quiz document by its ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
