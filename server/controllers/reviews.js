const DateLocation = require('../models/dateLocation');
const Review = require('../models/review');
const handleAsyncError = require('../utils/handleAsyncError');

module.exports.createReview = handleAsyncError(async (req, res) => {
    try {
        const location = await DateLocation.findById(req.params.id);
        if (!location) {
            return res.status(404).send('Location was not found');
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
        res.status(201).send({ location: newLocation, message: 'Review created successfully' });
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
        const updatedLocation = await DateLocation.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true })
            .populate({
                path: 'reviews',
                populate: { path: 'author' }
            })
            .populate('author');
        if (!updatedLocation) {
            return res.status(404).send('Location was not found');
        }
        res.status(200).send({ message: 'Review deleted successfully', location: updatedLocation });
    } catch (err) {
        res.status(500).send('Network Error: ' + err);
    }
});