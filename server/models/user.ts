import mongoose, { Schema, Types, HydratedDocument, PassportLocalModel } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export interface IUserImage {
    url?: string;
    filename?: string;
}

export interface IUser {
    // username is added by the passport-local-mongoose plugin
    username: string;
    email: string;
    isVerified: boolean;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    googleId?: string;
    displayName?: string;
    favLocations: Types.Array<Types.ObjectId>;
    avatar?: IUserImage;
}

export type UserDocument = HydratedDocument<IUser>;

const ImageSchema = new Schema<IUserImage>({
    url: String,
    filename: String
});

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
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

const User = mongoose.model<IUser, PassportLocalModel<IUser>>('User', UserSchema);
export default User;
