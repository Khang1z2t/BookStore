import {createContext, useContext, useEffect, useState} from "react";
import {getUserProfile} from "~/services/UserService";

const AuthContext = createContext()

const useAuth = () => useContext(AuthContext)

const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        getCurrentUser().then(r => r);
    }, []);

    const getCurrentUser = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        getUserProfile(token?.access_token).then((response) => {
            setCurrentUser(response?.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
    }

    const value = {
        currentUser,
        getCurrentUser,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider,
    useAuth
}
