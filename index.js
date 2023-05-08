dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import multer from 'multer';
import dotenv from 'dotenv';
import session from 'express-session';
import flash from 'connect-flash';
import authRouter from './routes/auth.js';
import passport from './config/passport.js';
import teacherRouter from './routes/teacher.js';
import studentRouter from './routes/student.js';
import uploadRouter from './routes/uploads.js';

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb+srv://bhagyesh:n5qhpM8miA9Kexsb@cluster0.lp1p4ad.mongodb.net/answerDB").then(console.log("Succesfully connected to the database"));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'abcd',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);
app.use('/uploads', uploadRouter);


app.get('/', function(req,res) {
  res.render('home');
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server started on port ${PORT}`);
});
