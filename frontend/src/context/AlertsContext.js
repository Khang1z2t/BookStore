import {createContext, useContext, useState} from "react";
import {Alert, Snackbar} from "@mui/material";
import SnackbarAlert from "~/components/Alerts";

const AlertsContext = createContext();

const useAlerts = () => useContext(AlertsContext);

const AlertsProvider = ({children}) => {
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'info',
        duration: 5000,
        vertical: 'top',
        horizontal: 'right'
    });

    const showAlert = (message, severity = 'info', duration= 5000, vertical= 'top', horizontal= 'right') => {
        setAlert({ open: true, message, severity, duration, vertical, horizontal });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ ...alert, open: false });
    };

    return (
        <AlertsContext.Provider value={{ showAlert }}>
            {children}
            <SnackbarAlert
                open={alert.open}
                message={alert.message}
                severity={alert.severity}
                duration={alert.duration}
                vertical={alert.vertical}
                horizontal={alert.horizontal}
                onClose={handleClose}
            />
        </AlertsContext.Provider>
    );
};

export { AlertsProvider, useAlerts };