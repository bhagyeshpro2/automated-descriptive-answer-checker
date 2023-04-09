dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import multer from 'multer';
import dotenv from 'dotenv';
import teacherRouter from './routes/teacher.js';
import studentRouter from './routes/student.js';
import uploadRouter from './routes/uploads.js';

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/answerCheckerDB").then(console.log("Succesfully connected to the database"));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);
app.use('/uploads', uploadRouter);


app.get('/', function(req,res) {
  res.render('home');
});

app.get('/registration', function(req,res) {
  res.render('auth/register');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server started on port ${PORT}`);
});
