import httpRequest from "~/utils/httpRequest";

const getAllProduct = async () => {
    const response = await httpRequest.get('/product/all', {});
    return response.data;
}

const findProductById = async (id) => {
    const response = await httpRequest.post(`/product/${id}`, {});
    return response.data;
}

const addProduct = async (data) => {
    const formData = new FormData();

    // Thêm các trường dữ liệu vào FormData
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('quantity', data.quantity);

    // Thêm file nếu có
    if (data.image) {
        formData.append('file', data.image);
    }
    const response = await httpRequest.post('/product', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

const updateProduct = async (id, data) => {
    const response = await httpRequest.put(`/product/${id}`, data);
    return response.data;
}

export {
    getAllProduct,
    findProductById,
    addProduct,
    updateProduct
}