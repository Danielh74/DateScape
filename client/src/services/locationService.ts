import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // Send cookies
});

export const getLocations = (locationName: string | null, categories: string | null) => {
    const params: Record<string, string> = {};
    if (locationName) {
        params.locationName = locationName;
    }
    if (categories) {
        params.categories = categories;
    }
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/locations?${queryString}` : '/locations';
    return api.get(url);
};
export const getLocation = (id: string) => api.get(`/locations/${id}`);
export const postLocation = (locationData: FormData) => api.post('/locations', locationData);
export const updateLocation = (id: string, locationData: FormData) => api.put(`/locations/${id}`, locationData);
export const deleteLocation = (id: string) => api.delete(`/locations/${id}`);