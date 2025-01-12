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
    }]
}, { ...options, timestamps: true });

DateLocationSchema.virtual('properties.popUpMarkup').get(function () {
    return {
        id: this._id,
        title: this.title,
        address: this.address

    };
});

DateLocationSchema.virtual('averageRating').get(function () {
    if (this.reviews.length === 0) return 0

    const avg = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
    return avg;
})

DateLocationSchema.post('findOneAndDelete', async function (location) {
    if (location) {
        await Review.deleteMany({ _id: { $in: location.reviews } });

        for (const img of location.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }
})

const DateLocation = mongoose.model('DateLocation', DateLocationSchema);
module.exports = DateLocation;