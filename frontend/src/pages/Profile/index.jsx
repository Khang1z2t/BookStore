import React, {useEffect} from 'react';
import UserProfile from "~/components/UserProfile";
import {getUserProfile} from "~/services/UserService";
import {useNavigate} from "react-router-dom";
import {useAuth} from "~/context/AuthContext";

function Profile() {
    const navigate = useNavigate();
    const {currentUser, getCurrentUser} = useAuth();

    return (
        <UserProfile user={currentUser} onEdit={() => navigate("/edit-profile")}/>
    )
}

export default Profile;