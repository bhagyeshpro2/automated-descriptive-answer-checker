import mongoose from 'mongoose';
const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  minScore: { type: Number, required: true },
  maxScore: { type: Number, required: true },
});

export default mongoose.model('Question', QuestionSchema);
