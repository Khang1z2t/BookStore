import {Alert, Button, Card, Spin, Table, Typography} from "antd";
import {useEffect, useState} from "react";
import {useAlerts} from "~/context/AlertsContext";
import {getAllProduct} from "~/services/ProductService";
import GoogleImage from "~/components/GoogleImage";

const {Title} = Typography;

function AdminBook() {
    const [products, setProducts] = useState([])
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
            title: 'Tiêu đề',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            key: 'description',
            render: (text) => text || 'Chưa có'
        },
        {
            title: 'Giá thành',
            dataIndex: 'price',
            key: 'price',
            render: (value) => {
                if (!value) return 'Chưa có';
                return `${Number(value).toLocaleString('vi-VN')} đ`;
            },
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text) => `${text} quyển` || 'Chưa có',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (text) => <GoogleImage width={100} imageId={text} /> || 'Chưa có',
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) =>
                value ? new Date(value).toLocaleDateString('en-GB') : 'Chưa có',
        },
    ]

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getAllProduct();
                setProducts(response.data)
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                setLoading(false);
            }
        }
        fetchProduct().then(r => r)
    }, []);

    const exportToPDF = async () => {

    }

    const exportToExcel = async () => {

    }

    return (
        <Card
            style={{
                margin: '12px auto',
                borderRadius: 8,
            }}
        >
            <Title level={4} style={{marginBottom: 16}}>
                Danh Sách Sản Phẩm
            </Title>

            <div style={{marginBottom: 16}}>
                <Button
                    type="primary"
                    style={{marginRight: 8}}
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

            {loading && <Spin/>}
            {error && <Alert message={error} type="error" showIcon/>}

            {!loading && !error && (
                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    pagination={{pageSize: 10}}
                />
            )}
        </Card>
    )
}

export default AdminBook