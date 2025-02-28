import {Alert, Button, Card, Form, Modal, Spin, Table, Typography} from "antd";
import {useEffect, useState} from "react";
import {useAlerts} from "~/context/AlertsContext";
import {getAllProduct} from "~/services/ProductService";
import GoogleImage from "~/components/GoogleImage";
import {LoadingOutlined} from "@ant-design/icons";
import ProductInput from "~/components/AdminInput/ProductInput";

const {Title} = Typography;

function AdminBook() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true);
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
            render: (text) => <GoogleImage width={100} imageId={text}/> || 'Chưa có',
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
            <Title level={4} style={{marginBottom: 16}}>
                Danh Sách Sản Phẩm
            </Title>

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
                    title={"Thên sản phẩm"}
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
                    <ProductInput form={form} onFinish={handleFinish}/>
                </Modal>
            </div>

            {loading && <LoadingOutlined/>}
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