import React, {useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {
    AppBar,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    Button, Avatar, Tooltip,
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import SearchIcon from '@mui/icons-material/Search';

import {Search, SearchIconWrapper, StyledInputBase} from '~/components/Layout/components/Search';
import {getUserProfile, getUserRole} from "~/services/UserService";
import {useAlerts} from "~/context/AlertsContext";
import CardButton from "~/components/Layout/components/CardButton";
import {useCart} from "~/context/CartContext";

const pages = ['Products', 'Pricing', 'Blog'];

function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const [role, setRole] = React.useState(null);
    const [settings, setSettings] = React.useState({
        profile: "Profile",
        account: "Account",
        dashboard: "Dashboard",
        logout: "Logout"
    });
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem('token'));
    const {showAlert} = useAlerts();
    const {updateCartCount} = useCart()

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleSettingClick = (settingKey) => {
        const settingValue = settings[settingKey];

        switch (settingValue) {
            case "Profile":
                navigate("/profile");
                break;
            case "Account":
                navigate("/account");
                break;
            case "Dashboard":
                navigate("/dashboard");
                break;
            case "Logout":
                handleLogout();
                navigate("/");
                showAlert("Logout successfully", "success");
                break;
            case "Admin":
                navigate("/admin");
                break;
            default:
                break;
        }
        handleCloseUserMenu();
    };


    const AuthBtn = () => {
        const location = useLocation();
        const isLogin = location.pathname === '/login';

        return (
            <Button variant="outlined"
                    component={Link}
                    to={isLogin ? '/register' : '/login'}
                    sx={{my: 2, color: 'white', display: 'block', outline: '0.5px solid white',}}>
                {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
        )
    }

    const getUser = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const response = await getUserProfile(token.access_token);
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
            showAlert('Failed to get user profile, please login again', 'error');
        }
    };

    useEffect(() => {
        getUser().then(r => r);
        checkUserRole().then(r => r);
    }, [navigate, role]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setSettings(prevSettings => {
            const newSettings = {...prevSettings}; // Copy object cũ
            delete newSettings?.admin; // Xóa "Admin" nếu có
            return newSettings;
        });
        setUser(null);
    }

    const checkUserRole = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) return null;
        const roleResponse = await getUserRole(token.access_token);
        setRole(roleResponse.data);
        setSettings(prevSettings => {
            const newSettings = {...prevSettings};

            if (roleResponse.data === "admin") {
                newSettings.admin = "Admin"; // Thêm nếu là admin
            } else {
                delete newSettings.admin; // Xóa nếu không phải admin
            }

            return newSettings;
        });
    }

    return (
        <AppBar position="sticky" sx={{backgroundColor: '#000000'}}>
            <Container>
                <Toolbar disableGutters>
                    <IconButton size="large" edge="start" color="inherit" aria-label="logo" component={Link} to="/">
                        <BookIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}>
                        Bookstore
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{display: {xs: 'block', md: 'none'}}}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography sx={{textAlign: 'center'}}>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        to="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {Object.entries(settings).map(([key, value]) => (
                            <MenuItem key={key} onClick={() => handleSettingClick(key)}>
                                {value}
                            </MenuItem>
                        ))}
                    </Box>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase placeholder="Search…" inputProps={{'aria-label': 'search'}}/>
                    </Search>

                    {user ? (
                        <>
                            <CardButton/>
                            <Box sx={{flexGrow: 0}}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                        <Avatar alt={user.username} src="/static/images/avatar/2.jpg"/>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{mt: '45px'}}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {Object.entries(settings).map(([key, value]) => (
                                        <MenuItem key={key} onClick={() => handleSettingClick(key)}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </>
                    ) : (
                        <Box><AuthBtn/></Box>
                    )}

                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;
