import express from 'express';
import { Router } from 'express';
import Question from '../models/Question.js';
const router = express.Router();
// Add routes for teacher portal here: add question, view questions, etc.
// Add question
router.get('/add-question', (req, res) => {
  res.render('teacher/addQuestion');
});

router.post('/add-question', async (req, res) => {
  const { question, answer, minScore, maxScore } = req.body;
  const newQuestion = new Question({ question, answer, minScore, maxScore });
  await newQuestion.save();
  res.redirect('/teacher/add-question');
});

// View questions
router.get('/view-questions', async (req, res) => {
  const questions = await Question.find();
  res.render('teacher/viewQuestions', { questions });
});

// module.exports = router;
export default router;
