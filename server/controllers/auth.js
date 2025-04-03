const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
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
            return res.status(500).json(err.message);
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

module.exports.updateFavLocations = handleAsyncError(async (req, res) => {
    const { locationId } = req.body;

    if (!locationId) {
        throw new ExpressError(400, "Location ID is required");
    }
    const user = await User.findById(req.user._id);

    if (user.favLocations.includes(locationId)) {
        await user.updateOne({ $pull: { favLocations: locationId } }, { new: true });
    } else {
        await user.updateOne({ $addToSet: { favLocations: locationId } }, { new: true });
    }

    const updatedUser = await User.findById(req.user._id);
    res.json({ user: updatedUser, message: 'Favorites updated successfully' });
});

module.exports.updateProfileImage = handleAsyncError(async (req, res) => {
    const image = req.files[0];
    const profileImage = { url: image.path, filename: image.filename }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { image: profileImage }, { new: true });
    res.json({ user: updatedUser, message: 'Profile image updated successfully' });
});