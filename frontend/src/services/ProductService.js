import httpRequest from "~/utils/httpRequest";
import qs from "qs";

const getAllProduct = async () => {
    const response = await httpRequest.get('/product/all', {
    });
    return response.data;
}

export {
    getAllProduct
}