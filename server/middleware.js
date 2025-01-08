const ExpressError = require('./utils/ExpressError');
const { dateLocationSchema, reviewSchema } = require('./schemas');
const DateLocation = require('./models/dateLocation');
const Review = require('./models/review');

module.exports.isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Not authorized');
    }
    next();
};

module.exports.storeOriginalPath = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.validateLocation = (req, res, next) => {
    if (req.body.location) {
        req.body.location = JSON.parse(req.body.location);
    }
    const { error } = dateLocationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(m => m.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.isLocationAuthor = async (req, res, next) => {
    const { id } = req.params;
    const currentLocation = await DateLocation.findById(id);
    if (!currentLocation.author.equals(req.user._id)) {
        return res.status(403).send({ error: 'You do not have permission to do that' });
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(m => m.message).join(',');
        throw new ExpressError(400, msg)
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const currentReview = await Review.findById(reviewId);
    if (!currentReview.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/locations/${id}`);
    }
    next();
};