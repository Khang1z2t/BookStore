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
import {Form, Input, Modal, Button as AntdButton} from "antd"; // Button của Ant Design với alias
import {Card, SignInContainer} from '~/components/Signin';
import ForgotPassword from '~/components/ForgotPassword';
import {FacebookIcon, GoogleIcon} from '~/components/CustomIcon';
import styles from './SignIn.module.scss';
import {useAlerts} from "~/context/AlertsContext";
import {loginUser, getUserProfile, sendResetPassword, verifyResetPassword} from "~/services/UserService";
import {updateCartItem} from "~/services/CartService";
import {useCart} from "~/context/CartContext";
import {useAuth} from "~/context/AuthContext";


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
    const {currentUser, getCurrentUser} = useAuth()
    const [resetPassword, setResetPassword] = useState({
        isEmailModalOpen: false,
        email: '',
        otpTimer: 60,
        isOtpModalOpen: false,
        otp: '',
        newPassword: '',
        confirmPassword: '',
        loadingSendMail: false,
        loading: false,
        loadingOtp: false
    })
    const handleClickOpen = () => {
        updateResetPassword({isEmailModalOpen: true})
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
                getCurrentUser()
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

    // Cập nhật state trong object
    const updateResetPassword = (newValues) => {
        setResetPassword((prev) => ({...prev, ...newValues}));
    };

    // Gửi email reset password
    const handleResetRequest = async (event) => {
        event.preventDefault();
        updateResetPassword({loading: true});
        try {
            // await sendResetPasswordEmail({email: resetPassword.email});
            showAlert('OTP đã được gửi đến email của bạn', 'success');
            updateResetPassword({isOtpModalOpen: true});
        } catch (err) {
            showAlert(
                err.response?.data?.message ||
                'Network error, please try again later' ||
                'An unexpected error occurred',
                'error'
            );
            console.error('Error:', err.message);
        } finally {
            updateResetPassword({loading: false});
        }
    };

    // Xác nhận OTP và reset password
    const handleOtpSubmit = async () => {
        if (resetPassword.newPassword !== resetPassword.confirmPassword) {
            showAlert('Mật khẩu xác nhận không khớp', 'error');
            return;
        }
        updateResetPassword({loading: true});
        await verifyResetPassword(resetPassword.email, resetPassword.otp).then((res) => {
            if (res?.data) {
                showAlert('Password đã được reset thành công', 'success');
                updateResetPassword({isOtpModalOpen: false});
                navigate("/login")
            } else {
                showAlert('OTP không hợp lệ', 'error');
            }
        }).catch((err) => {
            showAlert('OTP không hợp lệ', 'error');
            console.error('OTP Error:', err.message);
        }).finally(() => {
                updateResetPassword({
                    loading: false,
                    otp: '',
                    newPassword: ''
                });
            }
        )

    };

    const handleEmailSubmit = async () => {
        updateResetPassword({loadingSendMail: true});
        await sendResetPassword(resetPassword.email).then((res) => {
            showAlert('Mã OTP đã được gửi đến email của bạn', 'success');
            updateResetPassword({
                isEmailModalOpen: false,
                isOtpModalOpen: true,
                otpTimer: 60
            })
        }).catch((err) => {
            console.error(err);
        }).then(() => {
            updateResetPassword({loadingSendMail: false})
        })
    }

    const handleResendOtp = async () => {
        updateResetPassword({loadingOtp: true})
        await sendResetPassword(resetPassword.email).then((res) => {
            showAlert('Mã OTP đã được gửi lại', 'success');
            updateResetPassword({
                otpTimer: 60
            })
        }).finally(() => {
            updateResetPassword({loadingOtp: false})
        })
    }

    const handleEmailModalCancel = () => {
        updateResetPassword({
            isEmailModalOpen: false,
        })
    }

    const handleOtpModalCancel = () => {
        updateResetPassword({
            isOtpModalOpen: false,
            otp: '',
            newPassword: ''
        });
    };

    useEffect(() => {
        let timer;
        if (resetPassword.isOtpModalOpen && resetPassword.otpTimer > 0) {
            timer = setInterval(() => {
                updateResetPassword({otpTimer: resetPassword.otpTimer - 1});
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resetPassword.isOtpModalOpen, resetPassword.otpTimer]);

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
                        {/*<ForgotPassword open={open} handleClose={handleClose}/>*/}
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
            {/* Modal Nhập Email */}
            <Modal
                title="Nhập Email để Reset Password"
                open={resetPassword.isEmailModalOpen}
                onCancel={handleEmailModalCancel}
                footer={null}
                width={400}
            >
                <Form onFinish={handleEmailSubmit}>
                    <p className="mb-4 text-gray-600">
                        Vui lòng nhập email để nhận mã OTP:
                    </p>
                    <Form.Item
                        name="email"
                        rules={[
                            {required: true, message: 'Vui lòng nhập email!'},
                            {type: 'email', message: 'Email không hợp lệ!'}
                        ]}
                    >
                        <Input
                            value={resetPassword.email}
                            onChange={(e) => updateResetPassword({email: e.target.value})}
                            placeholder="Nhập email của bạn"
                            className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                    </Form.Item>
                    <Form.Item>
                        <div className="flex justify-end gap-2">
                            <AntdButton
                                onClick={handleEmailModalCancel}
                                className="border-gray-300"
                            >
                                Hủy
                            </AntdButton>
                            <AntdButton
                                type="primary"
                                htmlType="submit"
                                loading={resetPassword.loadingSendMail}
                                disabled={!resetPassword.email}
                            >
                                Gửi
                            </AntdButton>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
            {/* Modal OTP */}
            <Modal
                title="Xác nhận OTP và Reset Password"
                open={resetPassword.isOtpModalOpen}
                onCancel={handleOtpModalCancel}
                footer={null}
                width={400}
                bodyStyle={{padding: '24px'}}
            >
                <Form onFinish={handleOtpSubmit}>
                    <p className="mb-4 text-gray-600">
                        Vui lòng nhập mã OTP được gửi đến email và mật khẩu mới:
                    </p>
                    <Form.Item
                        name="otp"
                        rules={[
                            {required: true, message: 'Vui lòng nhập OTP!'},
                            {len: 6, message: 'OTP phải có 6 ký tự!'}
                        ]}
                    >
                        <div className="flex items-center gap-2">
                            <Input
                                value={resetPassword.otp}
                                onChange={(e) => updateResetPassword({otp: e.target.value})}
                                placeholder="Nhập OTP (6 chữ số)"
                                maxLength={6}
                                className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                            <AntdButton
                                onClick={handleResendOtp}
                                disabled={resetPassword.otpTimer > 0 || resetPassword.loading}
                                className="whitespace-nowrap"
                                loading={resetPassword.loadingOtp}
                            >
                                {resetPassword.otpTimer > 0 ? `Gửi lại (${resetPassword.otpTimer}s)` : 'Gửi lại'}
                            </AntdButton>
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        rules={[
                            {required: true, message: 'Vui lòng nhập mật khẩu mới!'},
                            {min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!'}
                        ]}
                    >
                        <Input.Password
                            value={resetPassword.newPassword}
                            onChange={(e) => updateResetPassword({newPassword: e.target.value})}
                            placeholder="Nhập mật khẩu mới"
                            className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword" // Sửa tên từ checkPassword thành confirmPassword
                        rules={[
                            {required: true, message: 'Vui lòng xác nhận mật khẩu mới!'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            value={resetPassword.confirmPassword}
                            onChange={(e) => updateResetPassword({confirmPassword: e.target.value})}
                            placeholder="Xác nhận mật khẩu mới"
                            className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                    </Form.Item>
                    <Form.Item>
                        <div className="flex justify-end gap-2">
                            <AntdButton onClick={handleOtpModalCancel}>
                                Hủy
                            </AntdButton>
                            <AntdButton
                                type="primary"
                                htmlType="submit"
                                loading={resetPassword.loading}
                                disabled={!resetPassword.otp || !resetPassword.newPassword || !resetPassword.confirmPassword}
                                // className="bg-blue-500 hover:bg-blue-600"
                            >
                                Xác nhận
                            </AntdButton>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default SignIn;
