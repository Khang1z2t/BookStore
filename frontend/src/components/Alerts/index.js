import React from 'react';
import {Snackbar, Alert, Slide} from '@mui/material';

const SnackbarAlert = ({
                           open,
                           message,
                           severity,
                           onClose,
                           duration,
                           vertical,
                           horizontal
}) => {
    function SlideTransition(props) {
        return <Slide {...props} direction="left" />;
    }


    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            TransitionComponent={SlideTransition}
            key={SlideTransition.name}
            sx={{ top: '80px !important' }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                sx={{ width: '100%', userSelect: 'none'
                }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarAlert;