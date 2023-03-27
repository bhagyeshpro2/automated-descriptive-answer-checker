import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import teacherRouter from './routes/teacher.js';
import studentRouter from './routes/student.js';
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/answerCheckerDB").then(console.log("Succesfully connected to the database"));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Routes
// app.use('/teacher', require('./routes/teacher'));
// app.use('/student', require('./routes/student'));
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);


app.get('/', function(req,res) {
  res.render('home');
});






// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server started on port ${PORT}`);
});
