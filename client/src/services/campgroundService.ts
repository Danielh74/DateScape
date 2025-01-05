import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const getAllCampgrounds = (campName: string | null) =>
    axios.get(`${baseUrl}${campName ? `?campName=${campName}` : ''}`);

const getCampground = (id: string) =>
    axios.get(`http://localhost:8080/api/campgrounds/${id}`);



export const campgroundsService = { getAllCampgrounds, getCampground };