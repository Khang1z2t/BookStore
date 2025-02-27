import {useEffect, useState} from "react";
import {useAlerts} from "~/context/AlertsContext";

import { Table, Button, Typography, Spin, Alert, Card } from 'antd';
import {exportExcel, exportPdf, getAllUser} from "~/services/UserService";

const { Title } = Typography;

function AdminUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {showAlert} = useAlerts();
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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUser();
                setUsers(response.data);
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                setLoading(false);
            }
        };

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

    return (
        <Card
            style={{
                margin: '12px auto',
                borderRadius: 8,
            }}
        >
            <Title level={4} style={{ marginBottom: 16 }}>
                Danh Sách Người Dùng
            </Title>

            <div style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    onClick={exportToExcel}
                >
                    Export Excel
                </Button>
                <Button
                    style={{
                        backgroundColor: '#ff4d4f',
                        color: '#fff',
                        border: 'none',
                        marginRight: 8,
                    }}
                    onClick={exportToPDF}
                >
                    Export PDF
                </Button>
            </div>

            {loading && <Spin />}
            {error && <Alert message={error} type="error" showIcon />}

            {!loading && !error && (
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </Card>
    )
}

export default AdminUser;