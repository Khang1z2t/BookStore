import React, {useEffect, useState} from 'react';
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
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import {FacebookIcon, GoogleIcon} from '~/components/CustomIcon';
import styles from './SignUp.module.scss';
import {loginUser, registerUser, sendVerification, verifyOtp} from '~/services/UserService';
import {useAlerts} from "~/context/AlertsContext";
import {Form, Input, Modal, Button as AntButton} from "antd";
import {useAuth} from "~/context/AuthContext";


const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({theme}) => ({
    minHeight: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

function SignUp({disableCustomTheme}) {
    const [register, setRegister] = React.useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
    });
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [firstNameError, setFirstNameError] = React.useState(false);
    const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState('');
    const [lastNameError, setLastNameError] = React.useState(false);
    const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState('');
    const {showAlert} = useAlerts();
    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [loadingOtp, setLoadingOtp] = useState(false)
    const [loading, setLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(60);
    const navigate = useNavigate();
    const {getCurrentUser} = useAuth();


    const validateInputs = () => {
        const email = document.getElementById('email');
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!username.value || username.value.length < 4) {
            setPasswordError(true);
            setPasswordErrorMessage('Username must be at least 4 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!firstName.value) {
            setFirstNameError(true);
            setFirstNameErrorMessage('First Name is required.');
            isValid = false;
        } else {
            setFirstNameError(false);
            setFirstNameErrorMessage('');
        }

        if (!lastName.value) {
            setLastNameError(true);
            setLastNameErrorMessage('Last Name is required.');
            isValid = false;
        } else {
            setLastNameError(false);
            setLastNameErrorMessage('');
        }

        return isValid;
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setRegister((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        if (register) {
            await registerUser(register).then(async (res) => {
                showAlert('Register Success', 'success');
                await sendVerification(register.email).then(() => {
                    setIsOtpModalVisible(true);
                })
            }).catch((err) => {
                showAlert(err.response?.data?.message || 'Network error, please try again later' || 'An unexpected error occurred', 'error');
                console.error('Error:', err.message);
            }).finally(() => {
                setLoading(false)
            })

        }
    };

    const getToken = async (username, password) => {
        await loginUser(username, password).then((res) => {
            const {access_token, refresh_token} = res.data;
            const token = {access_token, refresh_token};
            localStorage.setItem('token', JSON.stringify(token));
            showAlert('Login Success', 'success');
            getCurrentUser();
            navigate('/');
        });
    }


    const handleOtpSubmit = async () => {
        setLoading(true);
        // Giả sử bạn có API để verify OTP, gửi kèm thông tin user (ví dụ: email hoặc ID từ register)
        await verifyOtp(register.email, otp).then(async (res) => {
            if (res?.data) {
                setIsOtpModalVisible(false);
                await getToken(register.username, register.password);
            } else {
                showAlert('OTP verification failed', 'error');
            }
        }).catch((err) => {
            showAlert('OTP verification failed', 'error');
            console.error('OTP Error:', err.message);
        }).finally(() => {
            setLoading(false);
            setOtp('');
        });
    };

    const handleModalCancel = () => {
        setIsOtpModalVisible(false);
        setOtp('');
    };

    const handleResendOtp = async () => {
        setLoadingOtp(true);
        try {
            // Gọi API gửi lại OTP
            await sendVerification(register?.email);
            showAlert('OTP đã được gửi lại', 'success');
            setOtpTimer(60); // Reset timer
        } catch (err) {
            showAlert('Không thể gửi lại OTP', 'error');
        } finally {
            setLoadingOtp(false);
        }
    };

    useEffect(() => {
        let timer;
        if (isOtpModalVisible && otpTimer > 0) {
            timer = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isOtpModalVisible, otpTimer]);

    return (
        <>
            <CssBaseline enableColorScheme/>
            <SignUpContainer className={styles.SignUpContainer} direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <BookIcon/>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                    >
                        Sign up
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                    >
                        <FormControl>
                            <FormLabel htmlFor="firstName" sx={{userSelect: 'none'}}>
                                First name
                            </FormLabel>
                            <TextField
                                autoComplete="firstName"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                placeholder="First name"
                                error={firstNameError}
                                value={register.firstName}
                                onChange={handleInputChange}
                                helperText={firstNameErrorMessage}
                                color={firstNameError ? 'error' : 'inherit'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="lastName" sx={{userSelect: 'none'}}>
                                Last name
                            </FormLabel>
                            <TextField
                                autoComplete="lastName"
                                name="lastName"
                                required
                                fullWidth
                                id="lastName"
                                placeholder="Last name"
                                error={lastNameError}
                                value={register.lastName}
                                onChange={handleInputChange}
                                helperText={lastNameErrorMessage}
                                color={lastNameError ? 'error' : 'inherit'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="username" sx={{userSelect: 'none'}}>
                                Username
                            </FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                placeholder="yourusername"
                                name="username"
                                autoComplete="username"
                                variant="outlined"
                                error={usernameError}
                                value={register.username}
                                onChange={handleInputChange}
                                helperText={usernameErrorMessage}
                                color={usernameError ? 'error' : 'inherit'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email" sx={{userSelect: 'none'}}>
                                Email
                            </FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                placeholder="your@email.com"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                error={emailError}
                                value={register.email}
                                onChange={handleInputChange}
                                helperText={emailErrorMessage}
                                color={passwordError ? 'error' : 'inherit'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password" sx={{userSelect: 'none'}}>
                                Password
                            </FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                placeholder="********"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                variant="outlined"
                                error={passwordError}
                                value={register.password}
                                onChange={handleInputChange}
                                helperText={passwordErrorMessage}
                                color={passwordError ? 'error' : 'inherit'}
                            />
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="allowExtraEmails" color="inherit"/>}
                            label="I want to receive updates via email."
                            sx={{
                                userSelect: 'none',
                            }}
                        />
                        <Button type="submit" loading={loading} loadingPosition="start" fullWidth variant="contained"
                                onClick={validateInputs}
                                color="inherit">
                            Sign up
                        </Button>
                    </Box>
                    <Divider>
                        <Typography sx={{color: 'text.secondary'}}>or</Typography>
                    </Divider>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Google')}
                            startIcon={<GoogleIcon/>}
                            color="inherit"
                        >
                            Sign up with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Facebook')}
                            startIcon={<FacebookIcon/>}
                            color="inherit"
                        >
                            Sign up with Facebook
                        </Button>
                        <Typography sx={{textAlign: 'center'}}>
                            Already have an account?{' '}
                            <Typography
                                component={Link}
                                to="/login"
                                variant="body2"
                                sx={{
                                    alignSelf: 'center',
                                    color: '#000',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                }}
                            >
                                Sign in
                            </Typography>
                        </Typography>
                    </Box>
                </Card>
            </SignUpContainer>
            {/* Modal OTP */}
            <Modal
                title={<h3 className="text-xl font-semibold">Xác nhận OTP</h3>}
                open={isOtpModalVisible}
                onCancel={handleModalCancel}
                footer={
                    null
                }
                width={400}
                className="rounded-lg"
                bodyStyle={{padding: '24px'}}
            >
                <Form onFinish={handleOtpSubmit}>
                    <p className="mb-4 text-gray-600">
                        Vui lòng nhập mã OTP được gửi đến email của bạn:
                    </p>
                    <Form.Item
                        name="otp"
                        rules={[
                            {required: true, message: 'Vui lòng nhập OTP!'},
                            {len: 6, message: 'OTP phải có 6 ký tự!'}
                        ]}
                    >
                        <Input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Nhập OTP (6 chữ số)"
                            maxLength={6}
                            className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </Form.Item>
                    <Form.Item>
                        <div className="flex justify-end gap-2">
                            <AntButton onClick={handleResendOtp} disabled={otpTimer !== 0 || loadingOtp}>
                                Gửi lại OTP
                            </AntButton>
                            <AntButton onClick={handleModalCancel} className="border-gray-300">
                                Hủy
                            </AntButton>
                            <AntButton
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                Xác nhận
                            </AntButton>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default SignUp;
