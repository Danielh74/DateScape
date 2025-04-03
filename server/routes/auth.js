const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isAuthenticated } = require('../middleware')
const { loginUser, logoutUser, registerUser, checkAuthenticated, updateFavLocations, updateProfileImage } = require('../controllers/auth');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.post('/register', registerUser);
router.post('/login', passport.authenticate('local'), loginUser);
router.get('/logout', logoutUser);

router.route('/profile').put(isAuthenticated, upload.array('image'), updateProfileImage)
router.route('/check').get(isAuthenticated, checkAuthenticated);
router.route('/favorites').post(isAuthenticated, updateFavLocations);

module.exports = router;