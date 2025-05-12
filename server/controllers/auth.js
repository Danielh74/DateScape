const User = require('../models/user');
const handleAsyncError = require('../utils/handleAsyncError');

module.exports.loginUser = handleAsyncError(async (req, res) => {
    res.status(200).json({ user: req.user, message: 'Welcome back!' });
});

module.exports.checkAuthenticated = (req, res) => {
    res.status(200).json({ message: 'User is authenticated', user: req.user });
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.status(200).json('Logged out');
    });
};

module.exports.registerUser = handleAsyncError(async (req, res, next) => {
    const { username, email, password } = req.body;

    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) {
            console.error('Error logging in user:', err);
            return next(err);
        }
        res.status(200).json({ message: 'Registration successful!', user: req.user });
    });
});

module.exports.updateProfileImage = handleAsyncError(async (req, res) => {
    const image = req.files[0];
    const profileImage = { url: image.path, filename: image.filename }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { image: profileImage }, { new: true });
    res.json({ user: updatedUser, message: 'Profile image updated successfully' });
});