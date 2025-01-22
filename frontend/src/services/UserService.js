import httpRequest from "~/utils/httpRequest";
import qs from "qs";

const loginUser = async (username, password) => {
    const response = await httpRequest.post('/auth/login', {username, password});
    return response.data;
}

const registerUser = async (user) => {
    const response = await httpRequest.post('/auth/register', qs.stringify(user), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data;
}

const refreshToken = async (refreshToken) => {
    const response = await httpRequest.post('/auth/refresh-token', {refreshToken});
    return response.data;
}

const updateUser = async (user, token) => {
    const response = await httpRequest.put('/user/update', user, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

const getUserProfile = async (token) => {
    const response = await httpRequest.get('/user/profile', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}

export {loginUser, registerUser, getUserProfile, updateUser, refreshToken};