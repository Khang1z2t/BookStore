import keycloak from "~/keycloak";
import {Navigate, Outlet} from "react-router-dom";

function ProtectedRoute(){
    return keycloak.authenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;