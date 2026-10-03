import { DateLocation, updateAverageRating } from '../models/dateLocation';
import Review from '../models/review';
import ExpressError from '../utils/ExpressError';
import handleAsyncError from '../utils/handleAsyncError';

export const createReview = handleAsyncError(async (req, res) => {
    const location = await DateLocation.findById(req.params.id);

    if (!location) {
        throw new ExpressError(404, "Location was not found");
    }

    const review = new Review(req.body.review);
    review.author = req.user!._id;
    location.reviews.push(review._id);

    await review.save();
    await updateAverageRating(location);
    await location.save();

    await location.populate([
        {
            path: 'reviews',
            populate: { path: 'author' }
        },
        { path: 'author' }
    ]);

    res.status(201).json({ location: location, message: 'Review created successfully' });
});

export const deleteReview = handleAsyncError(async (req, res) => {
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

    await location.populate([
        {
            path: 'reviews',
            populate: { path: 'author' }
        },
        { path: 'author' }
    ]);

    res.status(200).json({ message: 'Review deleted successfully', location });
});
