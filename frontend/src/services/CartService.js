import httpRequest from "~/utils/httpRequest";

const getCart = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) return null;
    const response = await httpRequest.get('/cart', {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        }
    })
    return response.data;
}

const addToCart = async (data) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await httpRequest.post('/cart/add', data, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        }
    });
    return response.data;
}

const updateCartItem = async (data) => {
    const response = await httpRequest.put('/cart/update', data);
    return response.data;
}

const deleteCartItem = async (id) => {
    const response = await httpRequest.delete(`/cart/${id}`);
    return response.data;
}

const deleteCartByUser = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const response = await httpRequest.delete('/cart/user', {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        }
    });
    return response.data;
}

export {
    deleteCartItem,
    addToCart,
    getCart,
    updateCartItem,
    deleteCartByUser
}