import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/user';
import { generateVerificationToken, sendVerificationEmail } from './utils/emailService';

const backendURI = process.env.BACKEND_URI || 'http://localhost:8080/api';

passport.use(User.createStrategy());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: `${backendURI}/auth/google/callback`
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const userEmail = profile.emails?.[0]?.value;

            if (!userEmail) {
                return done(null, false, {
                    message: 'Google account does not provide an email address.'
                });
            };

            let user = await User.findOne({ email: userEmail });

            if (user) {
                if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save();
                };

                if (!user.isVerified) {
                    return done(null, false, { message: 'Please verify your email.' });
                };
            } else {

                user = await User.create({
                    googleId: profile.id,
                    username: userEmail,
                    displayName: profile.displayName,
                    email: userEmail,
                    isVerified: true
                });
            }
            done(null, user);
        } catch (err) {
            done(err);
        }
    }
));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
