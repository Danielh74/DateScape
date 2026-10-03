import mongoose, { Schema, Types, HydratedDocument } from 'mongoose';
import Review from './review';
import { cloudinary } from '../cloudinary';
import { categories as seedCategories } from '../seeds/seedHelpers';

export interface IImage {
    url: string;
    filename: string;
}

export interface IDateLocation {
    title: string;
    price: number;
    description: string;
    address: string;
    categories: string[];
    geometry: {
        type: 'Point';
        coordinates: number[];
    };
    images: IImage[];
    author: Types.ObjectId;
    reviews: Types.Array<Types.ObjectId>;
    averageRating: number;
}

export type DateLocationDocument = HydratedDocument<IDateLocation>;

const options = {
    toJSON: {
        virtuals: true,
    },
    timestamps: true
};

const ImageSchema = new Schema<IImage>({
    url: String,
    filename: String
}, { toJSON: { virtuals: true } });

ImageSchema.virtual('thumbnail').get(function (this: IImage) {
    return this.url.replace('/upload', '/upload/w_100');
})

const DateLocationSchema = new Schema<IDateLocation>({
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
            validator: (categories: string[]) => categories.length > 0,
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
                validator: (coordinates: number[]) => coordinates.length === 2,
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

DateLocationSchema.virtual('properties.popUpMarkup').get(function (this: DateLocationDocument) {
    return {
        id: this._id,
        title: this.title,
        address: this.address

    };
});

const updateAverageRating = async (location: DateLocationDocument): Promise<void> => {
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

DateLocationSchema.post('findOneAndDelete', async function (location: DateLocationDocument | null) {
    if (location) {
        await Review.deleteMany({ _id: { $in: location.reviews } });

        for (const img of location.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }
});

const DateLocation = mongoose.model<IDateLocation>('DateLocation', DateLocationSchema);
export { DateLocation, updateAverageRating };
