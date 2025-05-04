import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Send cookies
});

export const getLocations = (locationName: string) => {
    const query = new URLSearchParams();
    if (locationName) {
        query.append("locationName", locationName);
    }
    const url = `/locations${query.toString() ? `?${query}` : ''}`;
    return api.get(url);
};
type prop = {
    locationId: string
}
export const getLocation = (id: string) => api.get(`/locations/${id}`);
export const postLocation = (locationData: FormData) => api.post('/locations', locationData);
export const updateLocation = (id: string, locationData: FormData) => api.put(`/locations/${id}`, locationData);
export const deleteLocation = (id: string) => api.delete(`/locations/${id}`);
export const getFavoriteLocations = () => api.get('/locations/favorites');
export const updateFavLocation = (locationId: prop) => api.post(`/locations/favorites`, locationId);
export const getUserLocations = () => api.get('/locations/userlocations');