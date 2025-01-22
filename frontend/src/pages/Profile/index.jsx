import React, {useEffect} from 'react';
import UserProfile from "~/components/UserProfile";
import {getUserProfile} from "~/services/UserService";
import {useNavigate} from "react-router-dom";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = React.useState({});
    const [error, setError] = React.useState(null);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
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
        <UserProfile user={user} onEdit={() => navigate("/edit-profile")}/>
    )
}

export default Profile;