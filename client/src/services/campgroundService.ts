import axios from "axios";
import { User } from "../models/User";

const baseUrl = import.meta.env.VITE_BASE_URL;

const getAllCampgrounds = (campName: string | null) =>
    axios.get(`${baseUrl}${campName ? `?campName=${campName}` : ''}`, {
        withCredentials: true
    });

const getCampground = (id: string) =>
    axios.get(`http://localhost:8080/api/campgrounds/${id}`);

const deleteCampground = (id: string) =>
    axios.delete(`http://localhost:8080/api/campgrounds/${id}`);



export const campgroundsService = { getAllCampgrounds, getCampground, deleteCampground };