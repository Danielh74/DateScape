export interface CampgroundList {
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
    author: string,
    reviews: string[]
};

interface CampImage {
    url: string,
    name: string
};
