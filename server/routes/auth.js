const express = require('express');
const router = express.Router();
const passport = require('passport');
const { storeOriginalPath } = require('../middleware');
const { isAuthenticated } = require('../middleware')
const { loginUser, logoutUser, registerUser, checkAuthenticated } = require('../controllers/auth');

router.post('/register', registerUser);
router.post('/login', passport.authenticate('local'), loginUser);
router.route('/check').get(isAuthenticated, checkAuthenticated)
router.get('/logout', logoutUser)

module.exports = router;