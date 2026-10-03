const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cloudinaryCleanupSchema = new Schema({
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

cloudinaryCleanupSchema.in

const CloudinaryCleanup = mongoose.model('CloudinaryCleanup', cloudinaryCleanupSchema);
module.exports = CloudinaryCleanup;
