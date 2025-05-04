
export interface User {
    _id: string,
    username: string,
    displayName?: string,
    email: string,
    favLocations: string[],
    avatar: ProfileImage
};

interface ProfileImage {
    _id: string,
    url: string,
    filename: string,
};