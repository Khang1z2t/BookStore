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

const getUserRole = async (token) => {
    const response = await httpRequest.get('/auth/check-role', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

const getAllUser = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await httpRequest.get('/user/users', {
        headers: {
            Authorization: `Bearer ${token?.access_token}`
        }
    });
    return response.data;
}

const changeUserPassword = async (data, token) => {
    const response = await httpRequest.put('/user/change-password', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response?.data;
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

const getUserById = async (id) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await httpRequest.get(`/user/${id}`, {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    return response.data;
}

const sendVerification = async (email) => {
    const response = await httpRequest.post(`/auth/send-verification?email=${email}`);
    return response.data;
}

const verifyOtp = async (email, otp) => {
    const response = await httpRequest.post(`/auth/verify-otp?email=${email}&otp=${otp}`);
    return response.data;
}

const sendResetPassword = async (email) => {
    const response = await httpRequest.post(`/auth/send-reset-password?email=${email}`);
    return response.data;
}

const verifyResetPassword = async (email, otp) => {
    const response = await httpRequest.post(`/auth/verify-reset-otp?email=${email}&otp=${otp}`);
    return response.data;
}

const resetPassword = async (email, password) => {
    const response = await httpRequest.put(`/auth/reset-password?email=${email}&password=${password}`);
    return response.data;
}

export {
    loginUser,
    registerUser,
    getUserProfile,
    getUserById,
    updateUser,
    refreshToken,
    getUserRole,
    getAllUser,
    changeUserPassword,
    exportPdf,
    exportExcel,
    sendVerification,
    verifyOtp,
    sendResetPassword,
    verifyResetPassword,
    resetPassword
};