import {MdEmail} from 'react-icons/md';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {Avatar, Button, Card, Divider} from 'antd';
import {PhoneCall} from 'lucide-react';
import config from '~/config';

dayjs.extend(utc);

export const ProfileCard = ({data, setActiveTab}) => {
    return (
        <Card className="shadow-md rounded-lg p-6 bg-white border border-gray-300">
            <div className="flex flex-col items-center text-center">
                <Avatar children={data.username.charAt(0)} size={90} src={config.getImage(data.avatarUrl) || ""}
                        className="border border-gray-400"/>
                <h2 className="mt-3 text-xl font-semibold text-black">{data.username}</h2>
                <p className="text-gray-600">{data.firstName} {data.lastName}</p>
                <p className="text-sm text-gray-500">Thành viên từ {new Date(data.createdAt).getFullYear()}</p>
            </div>

            <Divider className="border-gray-300"/>

            {/* Giới thiệu */}
            <div className="mt-4">
                <h3 className="font-semibold text-black text-lg">Giới thiệu</h3>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="font-medium text-gray-700">Ngày sinh:</label>
                    <p className="text-gray-600">{dayjs.utc(data.dateOfBirth).format("DD/MM/YYYY")}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="font-medium text-gray-700">Địa chỉ:</label>
                    <p className="text-gray-600">{data.address || "Chưa cập nhật"}</p>
                </div>
            </div>

            {/* Liên hệ */}
            <div className="mt-4 space-y-2">
                <h3 className="font-semibold text-black text-lg">Liên hệ</h3>
                <p className="flex items-center gap-2 text-gray-700">
                    <PhoneCall size={20} className="text-black"/> {data.phoneNumber || "Chưa cập nhật"}
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                    <MdEmail size={20} className="text-black"/> {data.email}
                </p>
            </div>

            {/* Nút chỉnh sửa hồ sơ */}
            <div className="mt-6 flex justify-center">
                <Button onClick={() => setActiveTab('3')} color="default" variant="outlined"
                        className={'hover:border-gray-500'}>
                    Chỉnh sửa hồ sơ
                </Button>
            </div>
        </Card>
    );
};