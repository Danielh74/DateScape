import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext'

const useAuth = () => {
    const auth = useContext(AuthContext);

    if (!auth) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return auth
};

export default useAuth