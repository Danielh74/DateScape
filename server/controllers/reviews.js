const { DateLocation, updateAverageRating } = require('../models/dateLocation');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const handleAsyncError = require('../utils/handleAsyncError');

module.exports.createReview = handleAsyncError(async (req, res) => {
    const location = await DateLocation.findById(req.params.id);

    if (!location) {
        throw new ExpressError(404, "Location was not found");
    }

    const review = new Review(req.body.review);
    review.author = req.user._id;
    location.reviews.push(review);

    await review.save();
    await updateAverageRating(location);
    await location.save();

    const newLocation = await DateLocation.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('author');

    res.status(201).json({ location: newLocation, message: 'Review created successfully' });
});

module.exports.deleteReview = handleAsyncError(async (req, res) => {
    const { id, reviewId } = req.params;

    const location = await DateLocation.findById(id);

    if (!location) {
        throw new ExpressError(404, "Location was not found");
    }

    const isReviewExists = location.reviews.some(review => review.equals(reviewId))

    if (!isReviewExists) {
        throw new ExpressError(404, "Review was not found");
    }

    await Review.findByIdAndDelete(reviewId);

    location.reviews.pull(reviewId);

    await updateAverageRating(location);

    await location.save();

    await location
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('author');

    res.status(200).json({ message: 'Review deleted successfully', location });
});