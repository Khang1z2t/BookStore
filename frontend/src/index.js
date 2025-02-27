import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './tailwind.css'
import reportWebVitals from './reportWebVitals';
import GlobalStyles from "~/components/GlobalStyle";
import keycloak from "./keycloak";
import {Box, CircularProgress} from "@mui/material";
import {AlertsProvider} from "~/context/AlertsContext";

function Main() {
    const [keycloakInitialized, setKeycloakInitialized] = useState(false);

    useEffect(() => {
        keycloak
            .init({
                onLoad: "check-sso",
            })
            .then((authenticated) => {
                setKeycloakInitialized(true);
            })
            .catch(() => {
                console.error("Authenticated Failed");
            });
    }, []);

    if (!keycloakInitialized) {
        return (
            <>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}
                >
                    <CircularProgress></CircularProgress>
                </Box>
            </>
        );
    }

    return <App/>;
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GlobalStyles>
            <AlertsProvider>
                <App/>
            </AlertsProvider>
        </GlobalStyles>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
