const mongoose = require('mongoose');

const mcqQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from both ends of a string
  },
  options: [{
    type: String,
    required: true,
    trim: true,
  }],
  correctAnswer: {
    type: String,
    required: true,
    trim: true,
  },
  explanation: {
    type: String,
    trim: true, // Optional explanation for why the answer is correct
  },
  topic: {
    type: String,
    trim: true, // Categorize questions by topic
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'], // Restrict to specific difficulty levels
    default: 'Medium',
  },
  points: {
    type: Number,
    default: 1, // Points awarded for a correct answer
    min: 0,
  },
//   negativePoints: {
//     type: Number,
//     default: 0, // Points deducted for a wrong answer (optional)
//     min: 0,
//   },
  tags: [{
    type: String,
    trim: true, // Add keywords for easier searching and filtering
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const MCQQuestion = mongoose.model('MCQQuestion', mcqQuestionSchema);

module.exports = MCQQuestion;