const express = require("express");
const router = express.Router();
const SimulationContent = require("../Models/SimulationContent");

// GET /api/simulationContent/:id
// Retrieve simulation content by its ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const simulation = await SimulationContent.findById(id);
    if (!simulation) {
      return res.status(404).json({ message: "Simulation content not found" });
    }
    res.json(simulation);
  } catch (error) {
    console.error("Error fetching simulation content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/simulationContent
// Create new simulation content
router.post("/", async (req, res) => {
  try {
    const { topicId, embedUrl, description } = req.body;
    const newSimulation = await SimulationContent.create({ topicId, embedUrl, description });
    res.status(201).json({ message: "Simulation content created successfully", simulation: newSimulation });
  } catch (error) {
    console.error("Error creating simulation content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/simulationContent/:id
// Update existing simulation content by its ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { embedUrl, description } = req.body;
    const updatedSimulation = await SimulationContent.findByIdAndUpdate(
      id,
      { embedUrl, description },
      { new: true }
    );
    if (!updatedSimulation) {
      return res.status(404).json({ message: "Simulation content not found" });
    }
    res.json({ message: "Simulation content updated successfully", simulation: updatedSimulation });
  } catch (error) {
    console.error("Error updating simulation content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/simulationContent/:id
// Delete simulation content by its ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSimulation = await SimulationContent.findByIdAndDelete(id);
    if (!deletedSimulation) {
      return res.status(404).json({ message: "Simulation content not found" });
    }
    res.json({ message: "Simulation content deleted successfully" });
  } catch (error) {
    console.error("Error deleting simulation content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
