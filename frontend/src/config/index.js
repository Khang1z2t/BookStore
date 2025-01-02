import routes from "./routes";
import keycloak from "./keycloak";

const config = {
    baseUrl: "http://localhost:8080",
    routes,
    keycloak
}

export default config;