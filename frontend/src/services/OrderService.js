import httpRequest from "~/utils/httpRequest";

const getAllOrder = async () => {
    const response = await httpRequest.get('/order/all', {});
    return response.data;
}

const getAllOrderByStatus = async (status) => {
    const response = await httpRequest.get(`/order/status/${status}`, {});
    return response.data;
}

const findOrderById = async (id) => {
    const response = await httpRequest.get(`/order/${id}`, {});
    return response.data;
}

const createOrder = async (data) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        const response = await httpRequest.post("/order", data, {
            headers: {
                Authorization: `Bearer ${token.access_token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error.response?.data || error.message);
        throw error.response?.data || new Error("Không thể tạo đơn hàng.");
    }
};


const receiveOrder = async (id) => {
    const response = await httpRequest.post(`/order/${id}/receive`, {});
    return response.data;
}

export {
    getAllOrder,
    getAllOrderByStatus,
    findOrderById,
    createOrder,
    receiveOrder
}