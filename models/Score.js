import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
studentName: { type: String, required: true },
questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
studentAnswer: { type: String, required: true },
score: { type: String, required: true },
resultsPublished: { type: Boolean, default: false }, //added on 08-04
});

export default mongoose.model('Score', ScoreSchema);
