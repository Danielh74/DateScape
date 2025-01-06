import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // Send cookies
});

export const getAllCampgrounds = (campName: string | null) => api.get(`/campgrounds${campName ? `?campName=${campName}` : ''}`);
export const getCampground = (id: string) => api.get(`/campgrounds/${id}`);
export const postCampground = (campData: FormData) => api.post('/campgrounds', campData);
export const updateCampground = (id: string) => api.put(`/campgrounds/${id}`,);
export const deleteCampground = (id: string) => api.delete(`/campgrounds/${id}`);