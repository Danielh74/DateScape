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
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Send cookies
});

export const registerUser = (registerData: registerProps) => api.post('/register', registerData);
export const loginUser = (loginData: loginProps) => api.post('/login', loginData);
export const logoutUser = () => api.get('/logout');

export const updateProfileImage = (image: FormData) => api.put('/profile', image)
export const checkAuth = () => api.get(`/check`);
