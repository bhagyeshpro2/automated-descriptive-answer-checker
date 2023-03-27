// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
studentName: { type: String, required: true },
questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
studentAnswer: { type: String, required: true },
score: { type: String, required: true },
});

// module.exports = mongoose.model('Score', ScoreSchema);
export default mongoose.model('Score', ScoreSchema);
