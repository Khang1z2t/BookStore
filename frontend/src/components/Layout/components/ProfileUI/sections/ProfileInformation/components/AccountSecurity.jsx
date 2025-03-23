import {Button, Card, Form, Input, message, Modal} from 'antd';
import {useNavigate} from 'react-router-dom';
import config from '~/config';
import {LockOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {useAuth} from "~/context/AuthContext";
import {useState} from "react";
import {changeUserPassword, updateUser} from "~/services/UserService";
import {updateCartItem} from "~/services/CartService";
import {useAlerts} from "~/context/AlertsContext";

export const AccountSecurity = () => {
    const navigate = useNavigate();
    const {currentUser, getCurrentUser} = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const {showAlert} = useAlerts();
    const [form] = Form.useForm();

    const showModal = () => setIsModalOpen(true);

    // Xử lý đóng modal
    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    // Xử lý đổi mật khẩu
    const handleChangePassword = async () => {
        try {
            const values = await form.validateFields();
            const token = JSON.parse(localStorage.getItem('token'));
            setLoading(true);

            if (values.newPassword === values.oldPassword) {
                showAlert("Mật khẩu mới không được trùng mật khẩu cũ!", "error");
                setLoading(false);
                handleCancel()
                return;
            }

            await changeUserPassword(values, token?.access_token).then((res) => {
                showAlert("Đổi mật khẩu thành công", "success");
                handleCancel();
                getCurrentUser();
            }).catch((err) => {
                console.error("Lỗi đổi mật khẩu:", err);
                showAlert("Đổi mật khẩu thất bại", "error");
            })
        } catch (error) {
            console.error("Lỗi đổi mật khẩu:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        // <div className="w-100% mx-auto p-6">
        <Card className="shadow-lg border border-gray-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900">Bảo mật tài khoản</h2>
            <p className="text-gray-500">Quản lý thông tin đăng nhập và bảo mật tài khoản của bạn.</p>

            <div className="grid grid-cols-2 gap-6 mt-6">
                {/* Email */}
                <div>
                    <label className="font-medium text-gray-700">Tài khoản Email</label>
                    <Input
                        placeholder="Nhập email"
                        value={currentUser.email}
                        prefix={<MailOutlined className="text-gray-500"/>}
                        className="mt-2"
                    />
                </div>

                {/* Số điện thoại */}
                <div>
                    <label className="font-medium text-gray-700">Số điện thoại</label>
                    <Input
                        placeholder="Nhập số điện thoại"
                        value={currentUser.phoneNumber}
                        prefix={<PhoneOutlined className="text-gray-500"/>}
                        className="mt-2"
                    />
                </div>
            </div>

            {/* Đổi mật khẩu */}
            <div className="mt-6">
                <Button onClick={showModal} type="primary" icon={<LockOutlined/>}>
                    Đổi mật khẩu
                </Button>
            </div>

            {/* Modal Đổi mật khẩu */}
            <Modal
                title="Đổi mật khẩu"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleChangePassword}>
                        Lưu mật khẩu
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    {/* Mật khẩu hiện tại */}
                    <Form.Item
                        label="Mật khẩu hiện tại"
                        name="oldPassword"
                        rules={[{required: true, message: "Vui lòng nhập mật khẩu hiện tại!"}]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu hiện tại"/>
                    </Form.Item>

                    {/* Mật khẩu mới */}
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{required: true, message: "Vui lòng nhập mật khẩu mới!"}]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới"/>
                    </Form.Item>

                    {/* Xác nhận mật khẩu */}
                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            {required: true, message: "Vui lòng xác nhận mật khẩu mới!"},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject("Mật khẩu không khớp!");
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu mới"/>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Nút Lưu */}
            <div className="mt-6 flex justify-end">
                <Button
                    color="green" variant={"outlined"}
                    // className="bg-green-500 hover:bg-green-700 transition-all"
                >
                    Lưu thay đổi
                </Button>
            </div>
        </Card>
        // </div>
    );
};