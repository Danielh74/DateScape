import { DateLocation } from "../models/DateLocation";

const locationsOrder = (list: DateLocation[], order: string) => {
    let orderedList;
    switch (order) {
        case "Rating":
            orderedList = list.sort((a, b) => b.averageRating - a.averageRating);
            break;
        case "Newest":
            list.forEach(location => location.updatedAt = new Date(location.updatedAt));
            orderedList = list.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
            break;
        default:
            orderedList = list.sort((a, b) => b.averageRating - a.averageRating);
            break;
    }
    return orderedList;
}

export default locationsOrder