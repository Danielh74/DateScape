import { DateLocation } from "./DateLocation";

export interface User {
    _id: string,
    username: string,
    email: string,
    favLocations: DateLocation[]
}