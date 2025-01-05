const Campground = require('../models/campground');
const Review = require('../models/review');
const handleAsyncError = require('../utils/handleAsyncError');

module.exports.createReview = handleAsyncError(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.status(201).send({ campground });
})

module.exports.deleteReview = handleAsyncError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.status(200).end();
})