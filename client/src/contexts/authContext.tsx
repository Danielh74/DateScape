import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from '../models/User'
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
        const sessionData = sessionStorage.getItem('currentUser');
        if (sessionData) {
            setCurrentUser(JSON.parse(sessionData))
        } else {
            setCurrentUser(null)
        }
    }, []);

    const handleLogin = (userData: User) => {
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        setCurrentUser(userData);
    };

    const handleLogout = () => {
        if (sessionStorage.getItem('currentUser')) {
            sessionStorage.removeItem('currentUser');
            setCurrentUser(null)
        }
    };

    return <AuthContext.Provider value={{ currentUser, handleLogin, handleLogout }}>{children}</AuthContext.Provider>
};

export { AuthContext, AuthProvider }