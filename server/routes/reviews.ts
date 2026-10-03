import express from 'express';
import { validateReview, isAuthenticated, isReviewAuthor } from '../middleware';
import { createReview, deleteReview } from '../controllers/reviews';

const router = express.Router({ mergeParams: true });

router.post('/', validateReview, createReview);

router.delete('/:reviewId', isAuthenticated, isReviewAuthor, deleteReview)

export default router;
