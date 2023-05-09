import express from 'express';
import { Router } from 'express';
import Question from '../models/Question.js';
import Score from '../models/Score.js';
import openai from 'openai';
import path from 'path';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { evaluateAnswer } from '../utils.js';
const router = express.Router();

import multer from 'multer';
openai.apiKey = process.env.OPENAI_API_KEY;


// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

router.post('/submit-test', upload.array('answerSheet'), async (req, res) => {
  const studentName = req.body.name;
  const questionId = req.body.questionId;

  // Extract text from the uploaded scanned answer sheets
  const client = new ImageAnnotatorClient();
  const studentAnswers = await Promise.all((req.files || []).map(async (file) => {
    const [result] = await client.textDetection(file.path);
    const detections = result.textAnnotations;
    return detections[0].description;
  }));

  let index = 0;
  for (const studentAnswer of studentAnswers) {
    const {question, answer, minScore, maxScore} = await Question.findById(questionId[index]).exec();
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

  res.redirect('/teacher/view-answers');

});

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

// view name of students who submitted the answers
router.get('/view-answers', isAuthenticated('teacher'), async (req, res) => {
  try {
    const submissions = await Score.distinct('studentName').populate('questionId');
    res.render('teacher/viewAnswers', { submissions });
  } catch (error) {
    console.log('Error fetching submissions:', error.message);
    res.status(500).send('Error fetching submissions');
  }
});

// response of a particular student
router.get('/view-student-answers', isAuthenticated('teacher'), async (req, res) => {
  const studentName = req.query.studentName;
  const submissions = await Score.find({ studentName }).populate('questionId');
  res.render('teacher/viewStudentAnswers', { studentName, submissions });
});

router.get('/view-student-answers/:studentName', isAuthenticated('teacher'), async (req, res) => {
  const studentName = req.params.studentName;
  const submissions = await Score.find({ studentName }).populate('questionId');
  res.render('teacher/viewStudentAnswers', { studentName, submissions });
});

// Publish Result
router.get('/results-published', isAuthenticated('teacher'), (req, res) => {
  res.render('teacher/resultsPublished');
});

router.post('/publish-results', isAuthenticated('teacher'), async (req, res) => {
  try {
    const scores = await Score.updateMany({}, { $set: { resultsPublished: true } });
    res.redirect('/teacher/results-published');
  } catch (error) {
    console.log('Error publishing results:', error.message);
    res.status(500).send('Error publishing results');
  }
});

// Upload Answer Sheet
router.get('/upload-answers', async (req, res) => {
  const questions = await Question.find();
  res.render('teacher/uploadAnswers', { questions });
});


// delete question
router.post('/delete-question', isAuthenticated('teacher'), async (req, res) => {
  const questionId = req.body.questionId;
  await Question.findByIdAndDelete(questionId); // delete question from database
  await Score.deleteMany({ questionId }); // delete scores related to the question
  res.redirect('/teacher/view-questions');
});

// update scores
// Update score
router.post('/update-score', isAuthenticated('teacher'), async (req, res) => {
  const { submissionId, newScore } = req.body;
  try {
    const submission = await Score.findById(submissionId);
    submission.score = newScore;
    await submission.save();
    res.status(200).send({ message: 'Score updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to update score' });
  }
});


export default router;
