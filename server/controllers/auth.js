const User = require('../models/user');
const handleAsyncError = require('../utils/handleAsyncError');

module.exports.loginUser = handleAsyncError(async (req, res) => {
    res.send(req.user);
})

module.exports.logoutUser = (req, res, next) => {
    req.logout(err => {
        if (err) return res.status(500).send(err.message);
        res.send('Logged out');
    });
};

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