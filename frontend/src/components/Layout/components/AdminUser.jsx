import {useEffect, useState} from "react";
import {useAlerts} from "~/context/AlertsContext";

import {Table, Button, Typography, Spin, Alert, Card, Modal, Form, Input} from 'antd';
import {exportExcel, exportPdf, getAllUser} from "~/services/UserService";
import {LoadingOutlined, ReloadOutlined, UploadOutlined} from "@ant-design/icons";
import UserInput from "~/components/AdminInput/UserInput";

const {Title} = Typography;

function AdminUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [error, setError] = useState(null);
    const {showAlert} = useAlerts();
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            // index + 1 để đánh số thứ tự
            render: (_, __, index) => index + 1,
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Họ và tên',
            key: 'fullName',
            render: (_, record) => {
                const fullName = `${record.firstName || ''} ${record.lastName || ''}`.trim();
                return fullName || 'Chưa có';
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => text || 'Chưa có',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            render: (text) => text || 'Chưa có',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (text) => text || 'Chưa có',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (value) =>
                value ? new Date(value).toLocaleDateString('en-GB') : 'Chưa có',
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) =>
                value ? new Date(value).toLocaleDateString('en-GB') : 'Chưa có',
        },
    ];

    const fetchUsers = async () => {
        setTableLoading(true)
        try {
            const response = await getAllUser();
            setUsers(response.data);
        } catch (error) {
            showAlert(error.message, 'error');
        } finally {
            setLoading(false);
            setTableLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers().then(r => r);
    }, []);

    const exportToPDF = async () => {
        try {
            const response = await exportPdf();
            const blob = new Blob([response], {type: 'application/pdf'});
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'user_report.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            showAlert(error.message, 'error');
        }
    }
    const exportToExcel = async () => {
        try {
            const response = await exportExcel();
            const blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'user_report.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting Excel:', error);
            showAlert(error.message, 'error');
        }
    };

    const handleFinish = (values) => {
        console.log('Form values:', values);
        // Gọi API thêm người dùng ở đây
        setVisible(false);
        form.resetFields();
    };


    return (
        <Card
            style={{
                margin: '12px auto',
                borderRadius: 8,
            }}
        >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Title level={4} style={{marginBottom: 16}}>
                    Danh Sách Người dùng
                </Title>
                {/* Nút làm mới */}
                <Button
                    icon={<ReloadOutlined/>}
                    loading={tableLoading}
                    onClick={fetchUsers}
                    color={'default'}
                    variant={'text'}
                >
                </Button>
            </div>

            <div className={"mb-4 flex justify-between items-center"}>
                <div>
                    <Button
                        color="cyan" variant="outlined"
                        style={{marginRight: 8}}
                        onClick={exportToExcel}
                    >
                        Export Excel
                    </Button>
                    <Button
                        color="danger" variant="outlined"
                        onClick={exportToPDF}
                    >
                        Export PDF
                    </Button>
                </div>
                <Button color="default"
                        variant="solid"
                        onClick={() => setVisible(true)}>
                    Add
                </Button>
                <Modal
                    title={"Thêm người dùng"}
                    centered
                    open={visible}
                    onOk={() => form.submit()}
                    onCancel={() => setVisible(false)}
                    okText={"Thêm"}
                    cancelText={"Hủy"}
                    width={{
                        xs: '90%',
                        sm: '80%',
                        md: '70%',
                        lg: '60%',
                        xl: '50%',
                        xxl: '40%',
                    }}>
                    <UserInput form={form} onFinish={handleFinish}/>
                </Modal>
            </div>

            {loading && <LoadingOutlined/>}
            {error && <Alert message={error} type="error" showIcon/>}

            {!loading && !error && (
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    pagination={{pageSize: 10}}
                />
            )}
        </Card>
    )
}

export default AdminUser;