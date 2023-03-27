// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  minScore: { type: Number, required: true },
  maxScore: { type: Number, required: true },
});

// module.exports = mongoose.model('Question', QuestionSchema);
export default mongoose.model('Question', QuestionSchema);
