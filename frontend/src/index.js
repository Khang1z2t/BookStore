import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './tailwind.css'
import reportWebVitals from './reportWebVitals';
import GlobalStyles from "~/components/GlobalStyle";
import {AlertsProvider} from "~/context/AlertsContext";
import {CartProvider} from "~/context/CartContext";
import {AuthProvider} from "~/context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GlobalStyles>
            <AuthProvider>
                <CartProvider>
                    <AlertsProvider>
                        <App/>
                    </AlertsProvider>
                </CartProvider>
            </AuthProvider>
        </GlobalStyles>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
