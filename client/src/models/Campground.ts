import { Review } from './Review'
import { User } from './User'

export interface Campground {
    id: string
    title: string,
    price: number,
    description: string,
    location: string,
    geometry: {
        type: string,
        coordinates: [number, number]
    },
    images: CampImage[],
    author: User,
    reviews: Review[],
    averageRating: number,
    updatedAt: string
};

interface CampImage {
    _id: string,
    url: string,
    filename: string,
    thumbnail: string
};
