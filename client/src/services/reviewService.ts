import axios from "axios";

interface ReviewProp {
    rating: number,
    body: string

}

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // Send cookies
});

export const createReview = (id: string, review: ReviewProp) => api.post(`/locations/${id}/reviews`, { review });
export const deleteReview = (id: string, reviewId: string) => api.delete(`/locations/${id}/reviews/${reviewId}`);