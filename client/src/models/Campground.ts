import { Review } from './Review'
import { User } from './User'

export interface CampgroundList {
    id: string
    title: string,
    price: number,
    description: string,
    location: string,
    geometry: {
        type: string,
        coordinates: number[]
    },
    images: CampImage[],
    author: string,
    reviews: string[]
};

export interface Campground {
    id: string
    title: string,
    price: number,
    description: string,
    location: string,
    geometry: {
        type: string,
        coordinates: number
    },
    images: CampImage[],
    author: User,
    reviews: Review[]
};

interface CampImage {
    _id: string,
    url: string,
    name: string,
    thumbnail: string
};
