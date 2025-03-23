import {getUserProfile, refreshToken} from "~/services/UserService";
import {jwtDecode} from "jwt-decode";

const getUser = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
        return null;
    }
    const response = getUserProfile(token.access_token);
    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
}


const isTokenExpired = (token) => {
    if (!token) return;
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};

const refreshUserToken = async (token, navigate) => {
    if (isTokenExpired(token)) {
        navigate('/login');
        return;
    }

    try {
        const response = await refreshToken(token.refresh_token);
        const newToken = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token
        };
        localStorage.setItem('token', JSON.stringify(newToken));
    } catch (error) {
        console.error('Error refreshing token:', error);
        navigate('/login');
    }
}


export {getUser, refreshUserToken};