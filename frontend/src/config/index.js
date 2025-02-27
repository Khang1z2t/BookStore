import routes from "./routes";
import keycloak from "./keycloak";

const config = {
    baseUrl: "http://localhost:8070/api/v1",
    routes,
    keycloak
}

export default config;