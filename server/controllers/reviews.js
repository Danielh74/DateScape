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
    const newCampground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('author');
    res.status(201).send({ campground: newCampground });
});

module.exports.deleteReview = handleAsyncError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    const updatedCampground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true })
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('author');
    res.status(200).send({ message: 'Review deleted successfully', campground: updatedCampground });
});