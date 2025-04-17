import { Review } from './Review'
import { User } from './User'

export interface DateLocation {
    id: string
    title: string,
    price: number,
    description: string,
    address: string,
    geometry: {
        type: string,
        coordinates: [number, number]
    },
    categories: string[],
    images: LocationImage[],
    author: User,
    reviews: Review[],
    averageRating: number,
    updatedAt: Date
};

interface LocationImage {
    _id: string,
    url: string,
    filename: string,
    thumbnail: string
};
