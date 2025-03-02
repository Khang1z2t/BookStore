import httpRequest from "~/utils/httpRequest";

const getAllProduct = async () => {
    const response = await httpRequest.get('/product/all', {});
    return response.data;
}

const findProductById = async (id) => {
    const response = await httpRequest.post(`/product/${id}`, {});
    return response.data;
}


export {
    getAllProduct,
    findProductById
}