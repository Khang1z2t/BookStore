import React, {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {getUserRole} from "~/services/UserService";

const PrivateRoute = ({children}) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkUserRole = async () => {
            const token = JSON.parse(localStorage.getItem('token'));
            if (!token) {
                setIsAuthorized(false);
                return;
            }

            try {
                const roleResponse = await getUserRole(token.access_token);
                setIsAuthorized(roleResponse.data !== false);
            } catch (error) {
                setIsAuthorized(false);
            }
        };


        checkUserRole().then(r => r);
    }, []);

    if (isAuthorized === null) {
        return (
            <div className="flex justify-center items-center h-[400px]">
                <Spin indicator={<LoadingOutlined className={'text-black'} spin/>} size="large"/>
            </div>
        )
    }

    return isAuthorized ? children : <Navigate to="/not-found"/>;
};

export default PrivateRoute;