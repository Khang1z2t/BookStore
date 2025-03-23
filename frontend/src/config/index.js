import routes from "./routes";
import keycloak from "./keycloak";

const config = {
    baseUrl: "http://localhost:8070/api/v1",
    routes,
    keycloak,
    getCurrency : (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND',currencyDisplay: 'code' }).format(price);
    },
    convertDate: (date) => {
        return new Intl.DateTimeFormat('vi-VN').format(date);
    },
    getImage: (imageId) => {
        return `https://lh3.googleusercontent.com/d/${imageId}`;
    },
}

export default config;