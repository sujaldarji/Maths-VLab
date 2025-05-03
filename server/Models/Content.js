const mongoose = require('mongoose');

// Quiz Question Schema
const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: [opts => opts.length === 4, 'Exactly 4 options are required.']
  },
  correctAnswer: { type: String, required: true },
});

// Main Topic Schema
const topicSchema = new mongoose.Schema({
  topicId: { type: String, required: true, unique: true }, // Custom unique topic ID
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: [
    {
      type: {
        type: String,
        enum: ['text', 'video', 'quiz'],
        required: true
      },
      data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
      }
    }
  ]
}, { timestamps: true });

// Optional: Smaller sub-schemas for data validation (use in frontend/backend logic if needed)
const textContentSchema = new mongoose.Schema({
  text: { type: String, required: true }
});

const videoContentSchema = new mongoose.Schema({
  youtubeUrl: { type: String, required: true }
});

// Model Exports
const Topic = mongoose.model('Topic', topicSchema);

module.exports = {
  Topic,
  QuizQuestion: mongoose.model('QuizQuestion', quizQuestionSchema),
  TextContent: mongoose.model('TextContent', textContentSchema),
  VideoContent: mongoose.model('VideoContent', videoContentSchema)
};
