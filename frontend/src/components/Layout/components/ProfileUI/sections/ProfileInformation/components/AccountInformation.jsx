import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {Avatar, Input, Upload, message, Select, Button, DatePicker, Radio} from 'antd';
import {useEffect, useState} from 'react';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {useAuth} from "~/context/AuthContext";
import {updateUser} from "~/services/UserService";
import {useAlerts} from "~/context/AlertsContext";

const {Option} = Select;
dayjs.extend(utc)
dayjs.extend(timezone)

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
};


export const AccountInformation = () => {
    const [avatar, setAvatar] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gender, setGender] = useState(null);
    const {currentUser, getCurrentUser} = useAuth()
    const {showAlert} = useAlerts();
    const [userData, setUserData] = useState({
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        gender: currentUser.gender,
        address: currentUser.address,
        dateOfBirth: currentUser.dateOfBirth ? dayjs.utc(currentUser.dateOfBirth) : null,
    });

    useEffect(() => {

    }, [currentUser]);

    const handleUpdateUser = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        await updateUser(userData, token.access_token).then((res) => {
            getCurrentUser();
            showAlert("Cập nhật thông tin thành công");
        }).catch((err) => {
            showAlert("Cập nhật thông tin thất bại", "error");
        })
    }

    const handleChange = (field, value) => {
        setUserData((prev) => ({
            ...prev,
            [field]: field === "dateOfBirth" ? (value ? dayjs.utc(value) : null) : value,
        }));
    };

    return (
        <div className="container mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-300">
                <h2 className="text-2xl font-semibold text-black">Thông tin tài khoản</h2>

                {/* Avatar */}
                <div className="flex items-center gap-6 mt-4">
                    <Upload
                        name="avatar"
                        listType="picture-circle"
                        showUploadList={false}
                        beforeUpload={() => false} // Không upload lên server ngay
                        // onChange={handleChange}
                    >
                        {avatar ? (
                            <img src={avatar} alt="avatar"
                                 className="w-24 h-24 rounded-full object-cover border border-gray-300"/>
                        ) : (
                            <div className="flex flex-col items-center text-gray-500">
                                {loading ? <LoadingOutlined/> : <PlusOutlined/>}
                                <span className="text-xs mt-1">Tải ảnh lên</span>
                            </div>
                        )}
                    </Upload>

                    <div className="flex-1 space-y-3">
                        <div>
                            <label className="font-medium text-gray-700">Tên người dùng</label>
                            <Input defaultValue={currentUser.username} placeholder="Nhập tên người dùng" disabled
                                   className="w-full"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-medium text-gray-700">Họ</label>
                                <Input value={userData.lastName}
                                       onChange={(e) => handleChange("lastName", e.target.value)} className="w-full"/>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700">Tên</label>
                                <Input value={userData.firstName}
                                       onChange={(e) => handleChange("firstName", e.target.value)} className="w-full"/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email & Số điện thoại */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="font-medium text-gray-700">Email</label>
                        <Input value={userData.email} onChange={(e) => handleChange("email", e.target.value)}
                               className="w-full"/>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Số điện thoại</label>
                        <Input value={userData.phoneNumber}
                               onChange={(e) => handleChange("phoneNumber", e.target.value)}
                               className="w-full"/>
                    </div>
                </div>

                {/* Giới tính & Ngày sinh */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="font-medium text-gray-700">Giới tính</label>
                        <Radio.Group
                            className="w-full"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <Radio value="male">Nam</Radio>
                            <Radio value="female">Nữ</Radio>
                            <Radio value="other">Khác</Radio>
                        </Radio.Group>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Ngày sinh</label>
                        <DatePicker className="w-full" value={userData.dateOfBirth}
                                    onChange={(date) => handleChange("dateOfBirth", date)} format="DD/MM/YYYY"/>
                    </div>
                </div>

                {/* Địa chỉ */}
                <div className="mt-4">
                    <label className="font-medium text-gray-700">Địa chỉ</label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <Select className="w-full" placeholder="Chọn thành phố">
                            <Option value="Hanoi">Hà Nội</Option>
                            <Option value="HCM">Hồ Chí Minh</Option>
                            <Option value="Others">Khác</Option>
                        </Select>
                        <Select className="w-full" placeholder="Chọn quận huyện">
                            <Option value="GoVap">Gò Vấp</Option>
                            <Option value="Quan12">Quận 12</Option>
                            <Option value="Others">Khác</Option>
                        </Select>
                    </div>
                    <Input value={userData.address} onChange={(e) => handleChange("address", e.target.value)}
                           placeholder="Nhập địa chỉ chi tiết" className="mt-2 w-full"/>
                </div>

                {/* Mô tả bản thân */}
                <div className="mt-4">
                    <label className="font-medium text-gray-700">Mô tả bản thân</label>
                    <Input.TextArea rows={3} placeholder="Nhập mô tả về bạn" className="w-full"/>
                </div>

                {/* Nút lưu */}
                <div className="mt-6 flex justify-end">
                    <Button type="default" onClick={handleUpdateUser}
                            className="bg-black border border-gray-600 text-white px-6 py-2 rounded-lg">
                        Lưu thông tin thay đổi
                    </Button>
                </div>
            </div>
        </div>
    );
};