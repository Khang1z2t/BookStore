import {Box, CircularProgress, Typography} from "@mui/material";

function LoadingBox() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "90vh",
            }}
        >
            <CircularProgress color='inherit'></CircularProgress>
            <Typography pt='10px' fontWeight="600" sx={{userSelect: 'none'}}>
                Loading...
            </Typography>
        </Box>
    )
}

export default LoadingBox;