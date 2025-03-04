const DateLocation = require('../models/dateLocation');
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

    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
        throw new ExpressError(404, "Review was not found");
    }
    const updatedLocation = await DateLocation.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true })
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('author');
    if (!updatedLocation) {
        throw new ExpressError(404, "Location was not found");
    }
    res.status(200).json({ message: 'Review deleted successfully', location: updatedLocation });
});