// src/routes/topicRoutes.js
const express = require('express');
const { Topic } = require('../Models/Content');
const router = express.Router();

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

module.exports = router;
