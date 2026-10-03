import { Types } from 'mongoose';
import { IUser } from '../models/user';

declare global {
    namespace Express {
        // Makes req.user the app's user document shape instead of passport's empty User
        interface User extends IUser {
            _id: Types.ObjectId;
            id?: string;
        }
    }
}
