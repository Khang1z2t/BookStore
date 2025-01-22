import React from "react";
import { Avatar, Typography, Box, Paper, Grid, Button, Stack, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";

const UserProfile = ({ user, onEdit }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#e0f7fa", // Màu nền dịu nhẹ
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    padding: 4,
                    borderRadius: 4,
                    maxWidth: 600,
                    width: "90%",
                }}
            >
                {/* Avatar và Tên */}
                <Stack direction="column" alignItems="center" spacing={2}>
                    <Avatar
                        alt={user.username}
                        src={user.avatar}
                        sx={{
                            width: 120,
                            height: 120,
                            border: "4px solid #00796b", // Viền xung quanh avatar
                        }}
                    />
                    <Typography variant="h5" fontWeight="bold">
                        {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        @{user.username}
                    </Typography>
                </Stack>

                {/* Divider */}
                <Divider sx={{ marginY: 3 }} />

                {/* Thông tin chi tiết */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <PersonIcon color="primary" />
                            <Typography variant="subtitle1" color="text.secondary">
                                First Name:
                            </Typography>
                        </Stack>
                        <Typography variant="body1" sx={{ marginLeft: 4 }}>
                            {user.firstName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <PersonIcon color="primary" />
                            <Typography variant="subtitle1" color="text.secondary">
                                Last Name:
                            </Typography>
                        </Stack>
                        <Typography variant="body1" sx={{ marginLeft: 4 }}>
                            {user.lastName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <EmailIcon color="primary" />
                            <Typography variant="subtitle1" color="text.secondary">
                                Email:
                            </Typography>
                        </Stack>
                        <Typography variant="body1" sx={{ marginLeft: 4 }}>
                            {user.email}
                        </Typography>
                    </Grid>
                </Grid>

                {/* Nút chỉnh sửa */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 4,
                    }}
                >
                    <Button
                        variant="contained"
                        color="inherit"
                        startIcon={<EditIcon />}
                        onClick={onEdit}
                        sx={{
                            textTransform: "none", // Giữ chữ không viết hoa
                            paddingX: 3,
                            paddingY: 1.5,
                        }}
                    >
                        Edit Profile
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default UserProfile;