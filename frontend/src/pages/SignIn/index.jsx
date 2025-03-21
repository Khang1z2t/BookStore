import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import BookIcon from '@mui/icons-material/Book';
import {Card, SignInContainer} from '~/components/Signin';
import ForgotPassword from '~/components/ForgotPassword';
import {FacebookIcon, GoogleIcon} from '~/components/CustomIcon';
import styles from './SignIn.module.scss';
import {useAlerts} from "~/context/AlertsContext";
import {loginUser, getUserProfile} from "~/services/UserService";
import {updateCartItem} from "~/services/CartService";
import {useCart} from "~/context/CartContext";


function SignIn({disableCustomTheme}) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const {showAlert} = useAlerts();
    const navigate = useNavigate();
    const {updateCartCount} = useCart()
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username && password) {
            try {
                const response = await loginUser(username, password);
                showAlert('Login successful', 'success');
                const {access_token, refresh_token} = response.data;
                const token = {access_token, refresh_token};
                localStorage.setItem('token', JSON.stringify(token));
                navigate('/profile');
                updateCartCount();
                // const user = await getUserProfile(token.access_token).data;
            } catch (error) {
                if (error.response) {
                    // Server responded with a status other than 2xx
                    showAlert(error.response.data.message, 'error');
                    console.error('Login failed:', error.response.data.message);
                } else if (error.request) {
                    // Request was made but no response received
                    showAlert('Network error, please try again later', 'error');
                    console.error('Network error:', error.message);
                } else {
                    // Something else happened
                    showAlert('An unexpected error occurred', 'error');
                    console.error('Error:', error.message);
                }
            }
        }

    };

    const validateInputs = () => {
        const username = document.getElementById('username');
        const password = document.getElementById('password');

        let isValid = true;

        if (!username.value) {
            setUsernameError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setUsernameError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    return (
        <>
            <CssBaseline enableColorScheme/>
            <SignInContainer className={styles.SignInContainer} direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <BookIcon/>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                    >
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="username" sx={{userSelect: 'none'}}>
                                Username
                            </FormLabel>
                            <TextField
                                error={usernameError}
                                helperText={usernameErrorMessage}
                                id="username"
                                type="text"
                                name="username"
                                placeholder="your@email.com"
                                autoComplete="username"
                                autoFocus
                                required
                                fullWidth
                                onChange={(e) => setUsername(e.target.value)}
                                variant="outlined"
                                color={usernameError ? 'error' : 'inherit'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password" sx={{userSelect: 'none'}}>
                                Password
                            </FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                onChange={(e) => setPassword(e.target.value)}
                                variant="outlined"
                                color={passwordError ? 'error' : 'inherit'}
                            />
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="inherit"/>}
                            label="Remember me"
                            sx={{userSelect: 'none'}}
                        />
                        <ForgotPassword open={open} handleClose={handleClose}/>
                        <Button type="submit" fullWidth variant="contained" onClick={validateInputs} color="inherit">
                            Sign in
                        </Button>
                        <Typography
                            component={Link}
                            type="button"
                            onClick={handleClickOpen}
                            variant="body2"
                            sx={{
                                alignSelf: 'center',
                                color: '#000',
                                textDecoration: 'none',
                            }}
                        >
                            Forgot your password?
                        </Typography>
                    </Box>
                    <Divider>or</Divider>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign in with Google')}
                            startIcon={<GoogleIcon/>}
                            color="inherit"
                        >
                            Sign in with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign in with Facebook')}
                            startIcon={<FacebookIcon/>}
                            color="inherit"
                        >
                            Sign in with Facebook
                        </Button>
                        <Typography sx={{textAlign: 'center'}}>
                            Don&apos;t have an account?{' '}
                            <Typography
                                component={Link}
                                to="/register"
                                variant="body2"
                                sx={{
                                    alignSelf: 'center',
                                    color: '#000',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                }}
                            >
                                Sign up
                            </Typography>
                        </Typography>
                    </Box>
                </Card>
            </SignInContainer>
        </>
    );
}

export default SignIn;
