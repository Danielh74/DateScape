import axios from "axios";

type registerProps = {
    username: string,
    email: string,
    password: string
}

type loginProps = {
    username: string,
    password: string
}

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // Send cookies
});

export const registerUser = (registerData: registerProps) => api.post('/register', registerData);
export const loginUser = (loginData: loginProps) => api.post('/login', loginData);
export const checkAuth = () => api.get(`/check`);
export const logoutUser = () => api.get('/logout');