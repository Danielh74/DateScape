const mongoose = require('mongoose');
const Review = require('./review');
const { cloudinary } = require('../cloudinary');
const { categories: seedCategories } = require('../seeds/seedHelpers');
const Schema = mongoose.Schema;

const options = {
    toJSON: {
        virtuals: true,
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
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [2, 'Title must be at least 2 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters'],
        trim: true
    },

    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },

    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [2, 'Description must be at least 2 characters'],
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
        trim: true
    },

    address: {
        type: String,
        required: [true, 'Address is required'],
        minlength: [2, 'Address must be at least 2 characters'],
        maxlength: [200, 'Address cannot exceed 200 characters'],
        trim: true
    },

    categories: {
        type: [String],
        required: [true, 'Categories are required'],
        enum: {
            values: seedCategories,
            message: 'Invalid category'
        },
        validate: {
            validator: categories => categories.length > 0,
            message: 'At least one category is required'
        }
    },

    geometry: {
        type: {
            type: String,
            enum: {
                values: ['Point'],
                message: 'Geometry type must be Point'
            },
            required: [true, 'Geometry type is required']
        },

        coordinates: {
            type: [Number],
            required: [true, 'Coordinates are required'],
            validate: {
                validator: coordinates => coordinates.length === 2,
                message: 'Coordinates must contain longitude and latitude'
            }
        }
    },

    images: [ImageSchema],

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],

    averageRating: {
        type: Number,
        default: 0,
        min: [0, 'Average rating cannot be negative'],
        max: [5, 'Average rating cannot exceed 5']
    }

}, options);

DateLocationSchema.virtual('properties.popUpMarkup').get(function () {
    return {
        id: this._id,
        title: this.title,
        address: this.address

    };
});

const updateAverageRating = async (location) => {
    if (location.reviews.length === 0) {
        location.averageRating = 0;
        return;
    }

    const reviews = await Review.find({ _id: { $in: location.reviews } });

    if (reviews.length === 0) {
        location.averageRating = 0;
        return;
    }

    location.averageRating = reviews.reduce((sum, review) =>
        sum + review.rating
        , 0) / reviews.length;
};

DateLocationSchema.post('findOneAndDelete', async function (location) {
    if (location) {
        await Review.deleteMany({ _id: { $in: location.reviews } });

        for (const img of location.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }
});

const DateLocation = mongoose.model('DateLocation', DateLocationSchema);
module.exports = { DateLocation, updateAverageRating };