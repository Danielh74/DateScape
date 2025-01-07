import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from '../models/User'
import { checkAuth, logoutUser } from "../services/authService";
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
            console.log(res)
            setCurrentUser(res.data.user)
        }).catch(err => {
            console.log(err);
            setCurrentUser(null)
        })
    }, []);

    const handleLogin = (userData: User) => {
        sessionStorage.setItem('loggedIn', 'true');
        setCurrentUser(userData);
    };

    const handleLogout = () => {
        logoutUser().then(() => {
            setCurrentUser(null);
            sessionStorage.removeItem('loggedIn');
        }).catch(err => {
            console.log(err);
        });
    };

    return <AuthContext.Provider value={{ currentUser, handleLogin, handleLogout }}>{children}</AuthContext.Provider>
};

export { AuthContext, AuthProvider }