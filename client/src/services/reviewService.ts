import axios from "axios";

interface ReviewProp {
    rating: number,
    body: string

}

const api = axios.create({
    baseURL: 'http://localhost:8080/api/campgrounds',
    withCredentials: true, // Send cookies
});

export const createReview = (id: string, review: ReviewProp) => api.post(`/${id}/reviews`, { review });
export const deleteReview = (id: string, reviewId: string) => api.delete(`/${id}/reviews/${reviewId}`);