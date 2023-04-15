import express from 'express';
import { Router } from 'express';
import Question from '../models/Question.js';
import Score from '../models/Score.js';

const router = express.Router();

//Middleware
const isAuthenticated = (role) => {
return (req, res, next) => {
if (req.isAuthenticated() && req.user.role === role) {
return next();
}
res.redirect('/auth/login');
};
};

// Add question
router.get('/add-question',isAuthenticated('teacher'), (req, res) => {
  res.render('teacher/addQuestion');
});

router.post('/add-question', async (req, res) => {
  const { question, answer, minScore, maxScore } = req.body;
  const newQuestion = new Question({ question, answer, minScore, maxScore });
  await newQuestion.save();
  res.redirect('/teacher/add-question');
});

// View questions
router.get('/view-questions', isAuthenticated('teacher'), async (req, res) => {
  const questions = await Question.find();
  res.render('teacher/viewQuestions', { questions });
});

// View submitted answers
router.get('/view-answers', isAuthenticated('teacher'), async (req, res) => {
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
