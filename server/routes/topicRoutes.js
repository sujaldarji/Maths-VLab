// src/routes/topicRoutes.js
const express = require('express');
const { Topic } = require('../Models/Content');
const router = express.Router();
const authenticateUser= require('../middlewares/authMiddleware');
const checkRole= require("../middlewares/roleMiddleware");

// Get Single Topic by topicId
router.get('/:topicId', async (req, res) => {
  try {
    const topicId = req.params.topicId;

    // Try to find the requested topic
    let topic = await Topic.findOne({ topicId });

    // Fallback to default topic if not found
    if (!topic) {
      topic = await Topic.findOne({ topicId: 'default' });

      if (!topic) {
        return res.status(404).json({ error: 'Topic not found, and default topic is missing.' });
      }
    }

    // Restructure content for frontend
    const contentMap = {
      title: topic.title,
      description: topic.description
    };

    topic.content.forEach(item => {
      if (item.type === 'text') {
        contentMap.text = item.data.text;
      } else if (item.type === 'video') {
        contentMap.video = item.data.youtubeUrl;
      } else if (item.type === 'quiz') {
        contentMap.quiz = item.data; 
      }
    });

    res.json(contentMap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching topic' });
  }
});


// Create New Topic - Simplified
router.post('/add',
  authenticateUser,
  checkRole(['teacher', 'admin']),
  async (req, res) => {
    try {
      const { title, description } = req.body;

      // Simplified validation - only title and description required
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      // Generate topicId automatically
      const topicId = Date.now().toString();

      // Auto-generate content structure with description as text
      const content = [
        {
          type: "text",
          data: {
            text: description // Use description as the text content
          }
        },
        {
          type: "video",
          data: {
            youtubeUrl: "" // Empty video URL
          }
        },
        {
          type: "quiz",
          data: [] // Empty quiz array
        }
      ];

      // Check if topicId already exists (very unlikely with timestamp, but just in case)
      const existing = await Topic.findOne({ topicId });
      if (existing) {
        return res.status(400).json({ error: 'Topic with this ID already exists' });
      }

      // Create and save new topic
      const newTopic = new Topic({
        topicId,
        title,
        description,
        content
      });

      await newTopic.save();

      res.status(201).json({ 
        success: true,
        message: 'Topic created successfully', 
        topic: newTopic 
      });
    } catch (err) {
      console.error("Create topic error:", err);
      
      if (err.name === 'ValidationError') {
        return res.status(400).json({ 
          success: false,
          error: 'Validation failed: ' + err.message 
        });
      }
      
      if (err.code === 11000) {
        return res.status(400).json({ 
          success: false,
          error: 'Topic ID already exists' 
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Internal server error while creating topic' 
      });
    }
  }
);

/**
 * 🔹 Update Existing Topic
 * Protected: teacher or admin
 */
router.put(
  '/update/:topicId',
  authenticateUser,
  checkRole(['teacher', 'admin']),
  async (req, res) => {
    try {
      const { topicId } = req.params;
      const updates = req.body; // { title, description, content }

      const topic = await Topic.findOneAndUpdate({ topicId }, updates, { new: true });
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }

      res.json({ message: 'Topic updated successfully', topic });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating topic' });
    }
  }
);

/**
 * 🔹 Delete Topic
 * Protected: teacher or admin
 */
router.delete(
  '/delete/:topicId',
  authenticateUser,
  checkRole(['admin']),
  async (req, res) => {
    try {
      const { topicId } = req.params;

      const deleted = await Topic.findOneAndDelete({ topicId });
      if (!deleted) {
        return res.status(404).json({ error: 'Topic not found' });
      }

      res.json({ message: 'Topic deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting topic' });
    }
  }
);

module.exports = router;