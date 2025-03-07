import {Alert, Button, Card, Form, Image, Modal, Table, Tag, Typography} from "antd";
import {DeleteOutlined, LoadingOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import ProductInput from "~/components/AdminInput/ProductInput";
import {useEffect, useState} from "react";
import {useAlerts} from "~/context/AlertsContext";
import GoogleImage from "~/components/GoogleImage";
import {getAllOrder} from "~/services/OrderService";
import {getUserById} from "~/services/UserService";
import {findProductById} from "~/services/ProductService";

const {Title} = Typography;

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visibleDetail, setVisibleDetail] = useState(false);
    const [userMapping, setUserMapping] = useState({});
    const {showAlert} = useAlerts();

    const statusMapping = {
        ACTIVE: {color: "blue", label: "Đang Hoạt Động"},
        INACTIVE: {color: "red", label: "Không Hoạt Động"},
        REQUIRE_UPDATE: {color: "orange", label: "Cần Cập Nhật"},
        PENDING: {color: "gold", label: "Đang Chờ Xác Nhận"},
        COMPLETED: {color: "green", label: "Hoàn Thành"},
        CANCELLED: {color: "volcano", label: "Đã Hủy"},
        CONFIRMED: {color: "geekblue", label: "Đã Xác Nhận"},
    };
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
            dataIndex: 'orderInfo',
            key: 'orderInfo',
        },
        {
            title: 'Người đặt',
            dataIndex: 'userId',
            key: 'userId',
            render: (userId) => {
                return userMapping[userId] || userId;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const {color, label} = statusMapping[status] || {color: "default", label: status};
                return <Tag color={color}>{label}</Tag>;
            }
        },
        {
            title: 'Số lượng',
            dataIndex: 'totalProduct',
            key: 'totalProduct',
            render: (text) => `${text ? text : 0} quyển`,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (value) => {
                if (!value) return 'Chưa có';
                return `${Number(value).toLocaleString('vi-VN')} đ`;
            },
        },
        {
            title: 'Hành động',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_, record) => (
                <Button color="primary" variant="filled"
                        onClick={() => handleViewDetail(record)}
                >
                    Chi tiết
                </Button>
            ),
        },
    ]
    const columnDetails = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            // index + 1 để đánh số thứ tự
            render: (_, __, index) => index + 1,
        },
        {
            title: "Hình ảnh",
            dataIndex: "imageUrl",
            render: (text) =>
                <Image.PreviewGroup>
                    <Image src={`https://lh3.googleusercontent.com/d/${text}`} width={80}
                           height={100}/></Image.PreviewGroup>,
        },
        {
            title: "Product Id",
            dataIndex: "productId",
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
        },
        {
            title: "Giá",
            dataIndex: "price",
            render: (text) => <span>{text.toLocaleString("vi-VN")} đ</span>,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text) => `${text ? text : 0} quyển`,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (value) => {
                if (!value) return 'Chưa có';
                return `${Number(value).toLocaleString('vi-VN')} đ`;
            },
        },

    ]

    useEffect(() => {
        const userIds = Array.from(new Set(orders.map(order => order.userId)));
        Promise.all(
            userIds.map(async (userId) =>
                await getUserById(userId).then((r) => ({id: userId, name: r.data.username}))
            )
        ).then((users) => {
            const mapping = {};
            users.forEach((user) => {
                mapping[user.id] = user.name;
            });
            setUserMapping(mapping);
        })
            .catch((error) => {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            });
    }, [orders]);

    useEffect(() => {
        fetchOrder().then(r => r)
    }, []);

    const fetchOrder = async () => {
        setTableLoading(true);
        try {
            const response = await getAllOrder()
            setOrders(response.data)
        } catch (e) {
            showAlert("Không thể lấy đơn hàng", 'error')
        } finally {
            setLoading(false)
            setTableLoading(false);
        }
    }

    const fetchOrderDetail = async (order) => {
        setModalLoading(true)
        if (!order.orderDetails || order.orderDetails.length === 0) {
            setSelectedOrderDetails([])
            return
        }

        try {
            const productDetails = await Promise.all(
                order.orderDetails.map(async (order) => {
                    const product = await fetchProductById(order.productId);
                    return product
                        ? {
                            ...product,
                            id: order.id,
                            productId: order.productId,
                            quantity: order.quantity,
                            totalPrice: order.quantity * product.price,
                        }
                        : null;
                })
            )
            setSelectedOrderDetails(productDetails.filter((item) => item !== null));
        } catch (e) {
            showAlert("Không thể lấy chi tiết đơn hàng: " + e, 'error')
        } finally {
            setModalLoading(false)
        }
    }

    const fetchProductById = async (id) => {
        try {
            const response = await findProductById(id);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const exportToExcel = () => {

    }

    const exportToPDF = () => {

    }

    const handleViewDetail = async (order) => {
        setSelectedOrder(order)
        setVisibleDetail(true)
        await fetchOrderDetail(order)
    }

    return (
        <Card
            style={{
                margin: '12px auto',
                borderRadius: 8,
            }}
        >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Title level={4} style={{marginBottom: 16}}>
                    Danh Sách đơn đặt hàng
                </Title>
                {/* Nút làm mới */}
                <Button
                    icon={<ReloadOutlined/>}
                    loading={tableLoading}
                    onClick={fetchOrder}
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
                        onClick={() => setVisible(true)}>
                    Add
                </Button>
                <Modal
                    title={"Thêm đơn hàng"}
                    centered
                    open={visible}
                    onOk={() => setVisible(false)}
                    okText={"OK"}
                    width={{
                        xs: '90%',
                        sm: '80%',
                        md: '70%',
                        lg: '60%',
                        xl: '50%',
                        xxl: '40%',
                    }}>
                </Modal>
            </div>

            {loading && <LoadingOutlined/>}
            {error && <Alert message={error} type="error" showIcon/>}

            {!loading && !error && (
                <>
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey="id"
                        pagination={{pageSize: 10}}
                    />
                    <Modal
                        title={`Chi tiết đơn hàng: ${selectedOrder ? selectedOrder.orderInfo : ''}`}
                        centered
                        open={visibleDetail}
                        onCancel={() => {
                            setSelectedOrderDetails([])
                            setVisibleDetail(false)
                        }}
                        loading={modalLoading}
                        footer={[
                            <Button key="close"
                                    color='primary' variant={'solid'}
                                    onClick={() => {
                                        setSelectedOrderDetails([])
                                        setVisibleDetail(false)
                                    }}>
                                Đóng
                            </Button>
                        ]}
                        maskClosable={true}
                        width={{
                            xs: '90%',
                            sm: '80%',
                            md: '70%',
                            lg: '60%',
                            xl: '50%',
                            xxl: '40%',
                        }}>
                        <Table
                            columns={columnDetails}
                            dataSource={selectedOrderDetails}
                            rowKey="id"
                            pagination={false}
                        />
                        <div className="text-right mt-4 text-lg font-bold">
                            {selectedOrderDetails ? `Tổng tiền đơn hàng: ${selectedOrder?.totalPrice?.toLocaleString("vi-VN")} đ` : ''}
                        </div>
                    </Modal>
                </>
            )}
        </Card>
    )
}

export default OrderList