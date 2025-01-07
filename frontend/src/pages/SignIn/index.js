import React from 'react';
import { Link } from 'react-router-dom';
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
import { Card, SignInContainer } from '~/components/SignIn';
import ForgotPassword from '~/components/ForgotPassword';
import { FacebookIcon, GoogleIcon } from '~/components/CustomIcon';
import styles from './SignIn.module.scss';
import httpRequest from "~/utils/httpRequest";

function SignIn({ disableCustomTheme }) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username && password) {
            alert(`Username: ${username}\nPassword: ${password}`);
            const response = await loginUser(username, password);
            console.log(response);
        }
    };

    const validateInputs = () => {
        const username = document.getElementById('username');
        const password = document.getElementById('password');

        let isValid = true;

        // if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
        //     setEmailError(true);
        //     setEmailErrorMessage('Please enter a valid email address.');
        //     isValid = false;
        // } else {
        //     setEmailError(false);
        //     setEmailErrorMessage('');
        // }

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

    const loginUser = async (username, password) => {
        const response = await httpRequest.post('/api/v1/user/login', {username,password});
        return response.data;
    }
    return (
        <>
            <CssBaseline enableColorScheme />
            <SignInContainer className={styles.SignInContainer} direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <BookIcon />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
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
                            <FormLabel htmlFor="username" sx={{ userSelect: 'none' }}>
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
                            <FormLabel htmlFor="password" sx={{ userSelect: 'none' }}>
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
                            control={<Checkbox value="remember" color="inherit" />}
                            label="Remember me"
                            sx={{ userSelect: 'none' }}
                        />
                        <ForgotPassword open={open} handleClose={handleClose} />
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign in with Google')}
                            startIcon={<GoogleIcon />}
                            color="inherit"
                        >
                            Sign in with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign in with Facebook')}
                            startIcon={<FacebookIcon />}
                            color="inherit"
                        >
                            Sign in with Facebook
                        </Button>
                        <Typography sx={{ textAlign: 'center' }}>
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
