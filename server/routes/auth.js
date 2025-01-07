const express = require('express');
const router = express.Router();
const passport = require('passport');
const { storeOriginalPath } = require('../middleware');
const { loginUser, logoutUser, registerUser } = require('../controllers/auth');

router.post('/register', registerUser);
router.post('/login', passport.authenticate('local'), loginUser);
router.get('/logout', logoutUser)

module.exports = router;