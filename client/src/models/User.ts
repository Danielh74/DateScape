
export interface User {
    _id: string,
    username: string,
    email: string,
    favLocations: string[],
    image: ProfileImage
};

interface ProfileImage {
    _id: string,
    url: string,
    filename: string,
};