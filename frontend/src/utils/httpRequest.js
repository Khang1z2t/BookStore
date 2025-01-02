import axios from "axios";
import config from "~/config";

const httpRequest = axios.create({
    baseURL: config.baseUrl,
})

export const get = async (path, options = {}) => {
    const response = await httpRequest.get(path, options);
    return response.data
}

export default httpRequest;