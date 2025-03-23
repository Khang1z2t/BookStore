import {Alert, Button, Card, Form, Modal, Spin, Table, Typography} from "antd";
import {useEffect, useState} from "react";
import {useAlerts} from "~/context/AlertsContext";
import {addProduct, getAllProduct, updateProduct} from "~/services/ProductService";
import GoogleImage from "~/components/GoogleImage";
import {DeleteOutlined, EditOutlined, LoadingOutlined, ReloadOutlined} from "@ant-design/icons";
import ProductInput from "~/components/AdminInput/ProductInput";
import toast from "react-hot-toast";

const {Title} = Typography;

function AdminBook() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [error, setError] = useState(null);
    const {showAlert} = useAlerts();
    const [visible, setVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
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
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button
                        color="default" variant="outlined"
                        onClick={() => openEditModal(record)}
                        icon={<EditOutlined/>}
                    >
                    </Button>
                    <Button
                        color="danger" variant="outlined"
                        onClick={() => handleDelete(record)}
                        icon={<DeleteOutlined/>}
                    >
                    </Button>
                </div>
            )
        }
    ]

    const fetchProduct = async () => {
        setTableLoading(true)
        try {
            const response = await getAllProduct();
            setProducts(response.data)
        } catch (error) {
            showAlert(error.message, 'error');
        } finally {
            setLoading(false);
            setTableLoading(false)
        }
    }

    const openAddModal = () => {
        setIsEdit(false);
        setEditProduct(null);
        setVisible(true);
    };

    const openEditModal = (product) => {
        setIsEdit(true);
        setEditProduct(product);
        setVisible(true);
    };

    const handleAdd = async () => {

    }

    const handleDelete = async (record) => {
        console.log('Delete:', record)
    }

    useEffect(() => {
        fetchProduct().then(r => r)
    }, []);

    const exportToPDF = async () => {
        showAlert('test')
    }

    const exportToExcel = async () => {
        toast.success("Export Excel")
    }

    const handleFinish = async (values) => {
        if (isEdit) {
            await updateProduct(editProduct.id, values).then((res) => {
                console.log('Cập nhật sản phẩm:', res);
                showAlert("Sửa sản phẩm thành công", 'success');
            }).catch(error => {
                showAlert(error.message, 'error');
            })
        } else {
            await addProduct(values).then((res) => {
                console.log('Thêm sản phẩm:', res);
                showAlert("Thêm sản phẩm thành công", 'success');
            }).catch(error => {
                showAlert(error.message, 'error');
            })
        }
        await fetchProduct();
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
                    Danh Sách Sản phẩm
                </Title>
                {/* Nút làm mới */}
                <Button
                    icon={<ReloadOutlined/>}
                    loading={tableLoading}
                    onClick={fetchProduct}
                    color={'default'}
                    variant={'text'}
                    shape={'circle'}
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
                        onClick={openAddModal}>
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
                    <ProductInput form={form} onFinish={handleFinish} initialValues={editProduct}/>
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