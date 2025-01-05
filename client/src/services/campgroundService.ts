import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const getCampgrounds = (campName: string | null) =>
    axios.get(`${baseUrl}${campName ? `?campName=${campName}` : ''}`);


export const campgroundsService = { getCampgrounds };