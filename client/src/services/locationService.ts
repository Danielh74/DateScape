import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // Send cookies
});

export const getAllLocations = (locationName: string | null) => api.get(`/locations${locationName ? `?locationName=${locationName}` : ''}`);
export const getLocation = (id: string) => api.get(`/locations/${id}`);
export const postLocation = (locationData: FormData) => api.post('/locations', locationData);
export const updateLocation = (id: string, locationData: FormData) => api.put(`/locations/${id}`, locationData);
export const deleteLocation = (id: string) => api.delete(`/locations/${id}`);