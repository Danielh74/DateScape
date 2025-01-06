const express = require('express');
const { validateReview, isAuthenticated, isReviewAuthor } = require('../middleware');
const { createReview, deleteReview } = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

router.post('/', validateReview, createReview);

router.delete('/:reviewId', isAuthenticated, isReviewAuthor, deleteReview)

module.exports = router;