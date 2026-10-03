import mongoose, { Schema } from 'mongoose';

export interface ICloudinaryCleanup {
    filename: string;
    status: 'pending' | 'processing';
    attempts: number;
    lastAttempt: Date | null;
}

const cloudinaryCleanupSchema = new Schema<ICloudinaryCleanup>({
    filename: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing'],
        default: 'pending'
    },
    attempts: {
        type: Number,
        default: 0,
        min: 0
    },
    lastAttempt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const CloudinaryCleanup = mongoose.model<ICloudinaryCleanup>('CloudinaryCleanup', cloudinaryCleanupSchema);
export default CloudinaryCleanup;
