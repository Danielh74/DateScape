import axios from "axios";
const baseUrl = "http://localhost:8080/api";

type registerProps = {
    username: string,
    email: string,
    password: string
}

type loginProps = {
    username: string,
    password: string
}

const register = (data: registerProps) =>
    axios.post(`${baseUrl}/register`, data, {
        withCredentials: true
    });

const login = (data: loginProps) =>
    axios.post(`${baseUrl}/login`, data, {
        withCredentials: true
    });

const logout = () =>
    axios.get(`${baseUrl}/logout`, { withCredentials: true });

export const authService = { register, login, logout };