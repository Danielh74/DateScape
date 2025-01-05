import { User } from './User';

export interface Review {
    _id: string
    body: string,
    rating: number,
    author: User
}