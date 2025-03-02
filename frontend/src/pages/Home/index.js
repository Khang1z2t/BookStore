import {useEffect, useState} from "react";
import {Box, CircularProgress, Typography} from "@mui/material";
import BookList from "~/components/Book/BookList";
import {useAlerts} from "~/context/AlertsContext";
import {getAllProduct} from "~/services/ProductService";
import {getUserProfile} from "~/services/UserService";

function Home() {
    const [books, setBooks] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const {showAlert} = useAlerts();

    useEffect(() => {
        const fetchData = async () => {
            const token = JSON.parse(localStorage.getItem('token'));
            if (!token) {
                return;
            }
            try {
                const userResponse = await getUserProfile(token.access_token);
                setUser(userResponse.data);

                const productResponse = await getAllProduct();
                setBooks(productResponse.data);
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                setLoading(false);
            }
        };


        fetchData().then(r => r);
    }, []);

    if (loading || !user) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '90vh',
                }}
            >
                <CircularProgress color="inherit"/>
                <Typography pt="10px" fontWeight="600" sx={{userSelect: 'none'}}>
                    Loading, Please Login ...
                </Typography>
            </Box>
        );
    }


    return (
        <Box className={'mt-2 overflow-hidden'}>
            <BookList books={books}/>
        </Box>
    );
}

export default Home;