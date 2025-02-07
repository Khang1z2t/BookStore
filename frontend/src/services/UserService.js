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

const getUserRole = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await httpRequest.get('/auth/check-role', {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    return response.data;
}

const getAllUser = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await httpRequest.get('/user/users', {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    return response.data;
}

const exportPdf = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await httpRequest.get('/report/user/export-pdf', {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        },
        responseType: 'arraybuffer'
    });
    return response.data;
}

const exportExcel = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await httpRequest.get('/report/user/export-excel', {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        },
        responseType: 'arraybuffer'
    });
    return response.data;
}

export {
    loginUser,
    registerUser,
    getUserProfile,
    updateUser,
    refreshToken,
    getUserRole,
    getAllUser,
    exportPdf,
    exportExcel
};