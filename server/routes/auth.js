const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isAuthenticated } = require('../middleware')
const { loginUser, logoutUser, registerUser, checkAuthenticated, updateProfileImage, verifyEmail } = require('../controllers/auth');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const frontendURI = process.env.FRONTEND_URI || 'http://localhost:5173';

router.post('/register', registerUser);
router.post('/login', passport.authenticate('local'), loginUser);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}));
router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${frontendURI}/login`
    }),
    (req, res) => {
        res.redirect(`${frontendURI}/locations`);
    }
);

router.get('/verify-email', verifyEmail)

router.get('/logout', logoutUser);

router.put('/profile', isAuthenticated, upload.array('image'), updateProfileImage);
router.get('/check', isAuthenticated, checkAuthenticated);

module.exports = router;