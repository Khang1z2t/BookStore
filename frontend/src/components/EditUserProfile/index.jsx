import React, {useState, useEffect, useRef} from "react";
import { TextField, Button, Box, Paper, Typography, Stack, Avatar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import {useAlerts} from "~/context/AlertsContext";

const EditUserProfile = ({ user, onSave }) => {
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        username: user?.username || ''
    });
    const { showAlert } = useAlerts();

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                username: user.username || ''
            });
        }
    }, [user]);

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Lưu thông tin
    const handleSave = async () => {
        const updateUser = {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName
        }
        await onSave(updateUser);
        showAlert('Update successfully');
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#e0f7fa",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    borderRadius: 4,
                    maxWidth: 500,
                    width: "100%",
                }}
            >
                {/* Header */}
                <Stack direction="column" alignItems="center" spacing={2}>
                    <Avatar
                        src="https://drive.google.com/file/d/120KeZyc7Udd0bx0A94Ser03rxZRnfuu4/view?usp=drive_link"
                        alt={formData.username}
                        sx={{
                            width: 120,
                            height: 120,
                            border: "4px solid #1976d2",
                        }}
                    />
                    <Typography variant="h5" fontWeight="bold">
                        Edit Profile
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        @{formData.username}
                    </Typography>
                </Stack>

                {/* Form Inputs */}
                <Stack spacing={2} sx={{ marginTop: 3 }}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        variant="outlined"
                    />
                </Stack>

                {/* Save Button */}
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                    <Button
                        variant="contained"
                        color="inherit"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        sx={{
                            textTransform: "none",
                            paddingX: 3,
                            paddingY: 1.5,
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default EditUserProfile;