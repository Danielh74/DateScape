const mongoose = require('mongoose');
const Review = require('./review');
const { cloudinary } = require('../cloudinary');
const dayjs = require('dayjs');
const { categories: seedCategories } = require('../seeds/seedHelpers');
const Schema = mongoose.Schema;

const options = {
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.createdAt = dayjs(ret.createdAt).format('DD/MM/YYYY');
            ret.updatedAt = dayjs(ret.updatedAt).format('DD/MM/YYYY');
            return ret
        }
    },
    timestamps: true
};

const ImageSchema = new Schema({
    url: String,
    filename: String
}, { toJSON: { virtuals: true } });

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100');
})

const DateLocationSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    address: String,
    categories: {
        type: [String],
        enum: seedCategories,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    averageRating: Number
}, { ...options, timestamps: true });

DateLocationSchema.virtual('properties.popUpMarkup').get(function () {
    return {
        id: this._id,
        title: this.title,
        address: this.address

    };
});

DateLocationSchema.post('find', async function (locations) {
    if (locations && locations.length > 0) {
        for (const location of locations) {
            if (location.reviews.length === 0) {
                location.averageRating = 0; // Temporary field for average rating
                continue;
            }

            // Fetch the reviews (assuming reviews are references to another model)
            const reviewsList = await Promise.all(
                location.reviews.map((reviewId) => Review.findById(reviewId))
            );

            const avg =
                reviewsList.reduce((acc, review) => acc + review.rating, 0) /
                reviewsList.length;

            location.averageRating = avg; // Temporary storage
        }
    }
});

DateLocationSchema.post('findOne', async function (location) {
    if (location) {
        if (location.reviews.length === 0) {
            location.averageRating = 0; // Temporary field for average rating
            return;
        }

        // Fetch the reviews (assuming reviews are references to another model)
        const reviewsList = await Promise.all(
            location.reviews.map((reviewId) => Review.findById(reviewId))
        );

        const avg =
            reviewsList.reduce((acc, review) => acc + review.rating, 0) /
            reviewsList.length;

        location.averageRating = avg; // Temporary storage
    }
});

DateLocationSchema.post('findOneAndDelete', async function (location) {
    if (location) {
        await Review.deleteMany({ _id: { $in: location.reviews } });

        for (const img of location.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }
});

const DateLocation = mongoose.model('DateLocation', DateLocationSchema);
module.exports = DateLocation;