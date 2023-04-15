import express from 'express';
import passport from '../config/passport.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/register', (req, res) => {
res.render('register');
});

router.post('/register', async (req, res) => {
const { username, email, password, role } = req.body;
const newUser = new User({ username, email, password, role });
newUser.password = await newUser.encryptPassword(password);
await newUser.save();
req.flash('success', 'Registration successful! Please log in.');
res.redirect('/auth/login');
});

router.get('/login', (req, res) => {
res.render('login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true
  }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/auth/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      if (user.role === 'teacher') {
        return res.redirect('/teacher/add-question');
      } else if (user.role === 'student') {
        return res.redirect('/student/home');
      } else {
        return res.redirect('/');
      }
    });
  })(req, res, next);
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: '/auth/login'
  }, (err, user) => {
    if (err) {
      return next(err);
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      if (user.role === 'teacher') {
        return res.redirect('/teacher/add-question');
      } else if (user.role === 'student') {
        return res.redirect('/student/home');
      } else {
        return res.redirect('/');
      }
    });
  })(req, res, next);
});

router.get('/logout', (req, res)=> {
req.logout();
res.redirect('/');
});

export default router;
