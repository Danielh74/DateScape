const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeOriginalPath = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.validateCampground = (req, res, next) => {
    if (req.body.campground) {
        req.body.campground = JSON.parse(req.body.campground);
    }
    console.log(req.body)
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(m => m.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.isCampAuthor = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body)
    const currentCamp = await Campground.findById(id);
    if (req.body.user) {
        req.body.user = JSON.parse(req.body.user);
    }
    if (!currentCamp.author.equals(req.body.user._id)) {
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
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};