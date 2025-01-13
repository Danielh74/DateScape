const User = require('../models/user');
const handleAsyncError = require('../utils/handleAsyncError');

module.exports.loginUser = handleAsyncError(async (req, res) => {
    res.status(200).send({ user: req.user, message: 'Welcome back!' });
});

module.exports.checkAuthenticated = (req, res) => {
    res.status(200).send({ message: 'User is authenticated', user: req.user });
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(err => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).send('Logged out');
    });
};

module.exports.registerUser = handleAsyncError(async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                console.error('Error logging in user:', err);
                return next(err);
            }
            res.status(200).send({ message: 'Registration successful!', user: req.user });
        });
    } catch (e) {
        console.error('Error during registration:', e);
        res.status(500).send(e.message);
    }
});

module.exports.updateFavLocations = handleAsyncError(async (req, res) => {
    const { locationId } = req.body;

    if (!locationId) {
        return res.status(400).send('Location ID is required');
    }

    try {
        const user = await User.findById(req.user._id);


        if (user.favLocations.includes(locationId)) {
            await user.updateOne({ $pull: { favLocations: locationId } }, { new: true });
        } else {
            await user.updateOne({ $addToSet: { favLocations: locationId } }, { new: true });
        }

        const updatedUser = await User.findById(req.user._id);
        res.send({ user: updatedUser, message: 'Favorites updated successfully' });

    } catch (e) {
        console.error('Error during registration:', e);
        res.status(500).send(e.message);
    }
});