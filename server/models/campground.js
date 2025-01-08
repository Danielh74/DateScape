const mongoose = require('mongoose');
const Review = require('./review');
const { cloudinary } = require('../cloudinary');
const dayjs = require('dayjs');
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

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
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

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return {
        id: this._id,
        title: this.title,
        location: this.location

    };
})

CampgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground) {
        await Review.deleteMany({ _id: { $in: campground.reviews } });

        for (const img of campground.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }
})

const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;