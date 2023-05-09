import express from 'express';
import { Router } from 'express';
import Question from '../models/Question.js';
import Score from '../models/Score.js';
import openai from 'openai';
import path from 'path';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { evaluateAnswer } from '../utils.js';

import multer from 'multer';
openai.apiKey = process.env.OPENAI_API_KEY;

const router = express.Router();

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

// Upload Answer Sheet
router.get('/upload-answers', async (req, res) => {
  const questions = await Question.find();
  res.render('teacher/uploadAnswers', { questions });
});

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

// View scorecard
router.get('/view-scorecard', async (req, res) => {
  const studentName = req.query.studentName;
  const scores = await Score.find({ studentName }).populate('questionId');
  res.render('student/viewScorecard', { studentName, scores, pageName: "View Score Card" });
});

export default router;
