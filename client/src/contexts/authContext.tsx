import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from '../models/User'
import { checkAuth, logoutUser } from "../services/authService";
import { toast } from "react-toastify";
type AuthContextProps = {
    currentUser: User | null,
    handleLogin: (userData: User) => void,
    handleLogout: () => void
}

type Props = {
    children: ReactNode
}

const initialValues: AuthContextProps = {
    currentUser: null,
    handleLogin: () => { },
    handleLogout: () => { }
}
const AuthContext = createContext(initialValues)

function AuthProvider({ children }: Props) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        checkAuth().then(res => {
            setCurrentUser(res.data.user);
        }).catch(err => {
            if (err.status === 401) {
                setCurrentUser(null);
            } else {
                toast.error(err.message);
            }
        })
    }, []);

    const handleLogin = (userData: User) => {
        setCurrentUser(userData);
    };

    const handleLogout = () => {
        logoutUser().then(() => {
            setCurrentUser(null);
        }).catch(err => {
            toast.error(err.message);
        });
    };

    return <AuthContext.Provider value={{ currentUser, handleLogin, handleLogout }}>{children}</AuthContext.Provider>
};

export { AuthContext, AuthProvider }