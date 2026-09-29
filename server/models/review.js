const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: {
        type: String,
        min: [2, 'Must be at least 2 characters'],
        max: [1000, "can't be above 1000 characters"],
        required: [true, 'Body is required']
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, "Rating can't be above 5"],
        required: [true, "Rating is required"],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Autrhor is required"]
    }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
