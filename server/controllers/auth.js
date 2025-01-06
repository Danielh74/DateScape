const User = require('../models/user');
const handleAsyncError = require('../utils/handleAsyncError');

module.exports.loginUser = handleAsyncError(async (req, res) => {
    res.status(200).send({ currentUser: req.user });
})

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).end();
    });
}

module.exports.registerUser = handleAsyncError(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                console.log(err)
                return next(err);
            }
            res.status(200).end();
        });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

module.exports.viewRegisterForm = (req, res) => {
    res.render('auth/register');
}