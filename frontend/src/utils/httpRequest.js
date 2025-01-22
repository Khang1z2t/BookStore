import axios from "axios";
import config from "~/config";
import {useNavigate} from "react-router-dom";
import {refreshToken} from "~/services/UserService";
import {jwtDecode} from "jwt-decode";

const httpRequest = axios.create({
    baseURL: config.baseUrl,
})

let navigate;
export const setNavigate = (navFunction) => {
    navigate = navFunction;
};

// Thêm interceptor xử lý refresh token nếu cần
httpRequest.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (!error.response) {
            console.error('Network/Server error:', error);
            return Promise.reject(error);
        }
        if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            const token = JSON.parse(localStorage.getItem('token'));
            if (isTokenExpired(token.refresh_token)) {
                localStorage.removeItem('token');
                if (navigate) navigate('/login');
                return Promise.reject(error);
            }
            try {
                const response = await refreshToken(token.refresh_token);
                const newToken = {
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token
                };
                localStorage.setItem('token', JSON.stringify(newToken));
                httpRequest.defaults.headers.common['Authorization'] = `Bearer ${newToken.access_token}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken.access_token}`;
                return httpRequest(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                localStorage.removeItem('token');
                if (navigate) navigate('/login');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};

export const get = async (path, options = {}) => {
    const response = await httpRequest.get(path, options);
    return response.data
}

export const put = async (path, data, options = {}) => {
    const response = await httpRequest.put(path, data, options);
    return response.data
}

export const post = async (path, data, options = {}) => {
    const response = await httpRequest.post(path, data, options);
    return response.data
}

export default httpRequest;