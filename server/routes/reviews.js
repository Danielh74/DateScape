const express = require('express');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const { createReview, deleteReview } = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReview, createReview);

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, deleteReview)

module.exports = router;