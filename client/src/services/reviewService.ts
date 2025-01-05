import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
interface ReviewProp {
    rating: number,
    body: string
}
const createReview = (id: string | undefined, review: ReviewProp) =>
    axios.post(`${baseUrl}/${id}/reviews`, { review })



const deleteReview = (id: string | undefined, reviewId: string) =>
    axios.delete(`${baseUrl}/${id}/reviews/${reviewId}`);

export const reviewSrevice = { createReview, deleteReview };