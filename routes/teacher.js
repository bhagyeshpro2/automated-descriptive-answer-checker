import express from 'express';
import { Router } from 'express';
import Question from '../models/Question.js';
import Score from '../models/Score.js';

const router = express.Router();

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

// View submitted answers
router.get('/view-answers', async (req, res) => {
  const answers = await Score.find().populate('questionId');
  // console.log(answers);
  res.render('teacher/viewAnswers', { answers });
});

// Publish Result
router.post('/publish-results', async (req, res) => {
  await Score.updateMany({}, { $set: { resultsPublished: true } });
  res.redirect('/teacher/view-questions');
});

export default router;
