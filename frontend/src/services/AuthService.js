import httpRequest from "~/utils/httpRequest";

const loginUser = async (username, password) => {
    const response = await httpRequest.post('/public/login', { username, password });
    return response.data;
}

const autheticationUser = async () => {
    const response = await httpRequest.get('/auth/user');

    return response.data;
}

const test = async (token) => {
    const response = await httpRequest.get('/user/profile', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}

export {loginUser, test};