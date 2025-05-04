const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        unique: true
    },
    displayName: String,
    favLocations: [{
        type: Schema.Types.ObjectId,
        ref: 'DateLocation'
    }],
    avatar: ImageSchema
});
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
module.exports = User;
