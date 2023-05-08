dotenv.config();
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(new LocalStrategy({
usernameField: 'email',
passwordField: 'password'
}, async (email, password, done) => {
const user = await User.findOne({ email });
if (!user) {
return done(null, false, { message: 'Incorrect email.' });
}
if (!await user.validatePassword(password)) {
return done(null, false, { message: 'Incorrect password.' });
}
return done(null, user);
}));

passport.use(new GoogleStrategy({
clientID: process.env.GOOGLE_CLIENT_ID,
clientSecret: process.env.GOOGLE_CLIENT_SECRET,
callbackURL: 'http://localhost:3000/auth/google/callback',
scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
let user = await User.findOne({ googleId: profile.id });
if (!user) {
user = await User.create({
username: profile.displayName,
email: profile.emails[0].value,
password: '123456',
role: 'student',
googleId: profile.id
});
}
return done(null, user);
}));

passport.serializeUser((user, done) => {
done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
const user = await User.findById(id);
done(null, user);
});

export default passport;
