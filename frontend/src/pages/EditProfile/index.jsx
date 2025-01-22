import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import EditUserProfile from "~/components/EditUserProfile";
import {getUserProfile, updateUser} from "~/services/UserService";


function EditProfile() {
    const [user, setUser] = React.useState({});
    const [error, setError] = React.useState(null);
    const [token, setToken] = React.useState(JSON.parse(localStorage.getItem('token')));
    const navigate = useNavigate();

    const handleSaveProfile = async (updatedUser) => {
        try {
            const response = await updateUser(updatedUser, token.access_token);
            setUser(response.data); // Cập nhật thông tin user
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        const fetchUserProfile = async () => {
            try {
                const response = await getUserProfile(token.access_token);
                if (response) {
                    setUser(response.data);
                }
            } catch (error) {
                setError(error);
                navigate('/login');
            }
        };
        fetchUserProfile().then(r => r);
    }, []);
    return (
        <EditUserProfile user={user} onSave={handleSaveProfile}/>
    )
}

export default EditProfile;