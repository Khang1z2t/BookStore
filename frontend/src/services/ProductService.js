import httpRequest from "~/utils/httpRequest";

const getAllProduct = async () => {
    const response = await httpRequest.get('/product/all', {
    });
    return response.data;
}


export {
    getAllProduct
}