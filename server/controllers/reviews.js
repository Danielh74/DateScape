const Campground = require('../models/campground');
const Review = require('../models/review');
const handleAsyncError = require('../utils/handleAsyncError');

module.exports.createReview = handleAsyncError(async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            return res.status(404).send('Campground was not found');
        }
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
    } catch (err) {
        res.status(500).send('Network Error: ' + err);
    }

});

module.exports.deleteReview = handleAsyncError(async (req, res) => {
    const { id, reviewId } = req.params;
    try {
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        if (!deletedReview) {
            return res.status(404).send('Review was not found');
        }
        const updatedCampground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true })
            .populate({
                path: 'reviews',
                populate: { path: 'author' }
            })
            .populate('author');
        if (!updatedCampground) {
            return res.status(404).send('Campground was not found');
        }
        res.status(200).send({ message: 'Review deleted successfully', campground: updatedCampground });
    } catch (err) {
        res.status(500).send('Network Error: ' + err);
    }
});