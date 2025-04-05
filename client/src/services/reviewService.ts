import axios from "axios";

interface ReviewProp {
    rating: number,
    body: string

}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Send cookies
});

export const createReview = (id: string, review: ReviewProp) => api.post(`/locations/${id}/reviews`, { review });
export const deleteReview = (id: string, reviewId: string) => api.delete(`/locations/${id}/reviews/${reviewId}`);