const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isAuthenticated } = require('../middleware')
const { loginUser, logoutUser, registerUser, checkAuthenticated, updateFavLocations } = require('../controllers/auth');

router.post('/register', registerUser);
router.post('/login', passport.authenticate('local'), loginUser);
router.get('/logout', logoutUser);

router.route('/check').get(isAuthenticated, checkAuthenticated);
router.route('/favorites').post(isAuthenticated, updateFavLocations);

module.exports = router;