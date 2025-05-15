const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');
const { generateVerificationToken, sendVerificationEmail } = require('./utils/emailService');

const backendURI = process.env.BACKEND_URI || 'http://localhost:8080/api';

passport.use(User.createStrategy());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${backendURI}/auth/google/callback`
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const userEmail = profile.emails?.[0]?.value
            let user = await User.findOne({ email: userEmail })
            if (user) {
                if (!user.googleId) {
                    user.googleId = profile.id;
                    user.save();
                }
                if (!user.isVerified) {
                    return done(null, false, { message: 'Please verify your email.' });
                }
            } else {
                const token = generateVerificationToken();
                user = await User.create({
                    googleId: profile.id,
                    username: userEmail,
                    displayName: profile.displayName,
                    email: userEmail,
                    avatar: profile.photos?.[0]?.value,
                    verificationToken: token,
                    verificationTokenExpires: Date.now() + 15 * 60 * 1000,
                    isVerified: false
                });
                await sendVerificationEmail(userEmail, token);
            }
            done(null, user,);
        } catch (err) {
            done(err);
        }
    }
));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});