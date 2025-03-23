import { Avatar, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
export const EmptyProfileCard = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(config.routes.profile);
    }
    return (
        <Card className="shadow-md">
            <div className="flex flex-col items-center">
                <Avatar className={"bg-gray-200"} size={80} src="/img/logo.jpg"/>
                <h2 className="mt-2 text-lg font-semibold">Hãy cập nhật thông tin cá nhân</h2>
                <p className="text-gray-500">Để sử dụng các tính năng của hệ thống</p>
                <button onClick={handleClick} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">Cập nhật thông tin</button>
            </div>
        </Card>
    );
};