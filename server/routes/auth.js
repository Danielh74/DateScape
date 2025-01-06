const express = require('express');
const router = express.Router();
const passport = require('passport');
const { storeOriginalPath } = require('../middleware');
const { loginUser, logoutUser, registerUser } = require('../controllers/auth');

router.route('/register')
    .post(registerUser);

router.route('/login')
    .post(storeOriginalPath, passport.authenticate('local', {
        session: true,
    }), loginUser);

router.get('/logout', logoutUser)

module.exports = router;