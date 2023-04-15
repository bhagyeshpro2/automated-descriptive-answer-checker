import express from 'express';
import { Router } from 'express';
import Question from '../models/Question.js';
import Score from '../models/Score.js';
import User from '../models/User.js';
import openai from 'openai';
import { evaluateAnswer } from '../utils.js';
openai.apiKey = process.env.OPENAI_API_KEY;

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

// Student's Home Page
router.get('/home', isAuthenticated('student'), async (req, res) => {

  // console.log(studentName);
  res.render('student/homePage');
});

// Take test
router.get('/take-test', isAuthenticated('student'), async (req, res) => {
  const questions = await Question.find();
  res.render('student/takeTest', { questions });
});


//route to submit the test answers and evaluate them

router.post('/submit-test', async (req, res) => {
const studentName = req.body.name;
const questionId = req.body.questionId;
const studentAnswers = req.body.answer;

let index = 0;
for (const studentAnswer of studentAnswers) {
const {question, answer, minScore, maxScore} = await Question.findById(questionId[index]).exec();
  console.log(studentAnswer);
const score = await evaluateAnswer(answer, studentAnswer, minScore, maxScore);
    const newScore = new Score({
      studentName: studentName,
      questionId: questionId[index],
      studentAnswer: studentAnswer,
      score: score,
    });
    await newScore.save();
    index++;
}
  res.redirect(`/student/test-submitted?studentName=${studentName}`);
});

// Test submitted success page
router.get('/test-submitted', isAuthenticated('student'), async (req, res) => {
  const studentName = req.query.studentName;
  res.render('student/successPage', { studentName });
});

// View scorecard
router.get('/view-scorecard', isAuthenticated('student'), async (req, res) => {
  const studentName = req.query.studentName;
  const scores = await Score.find({ studentName, resultsPublished: true }).populate('questionId');
  res.render('student/viewScorecard', { studentName, scores, pageName: "View Score Card" });

});


export default router;
