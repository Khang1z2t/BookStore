import {useEffect, useState} from "react";
import {Button, Card, Empty, Input, Modal, Table, Tag, Typography, Tooltip} from "antd";
import {useNavigate} from "react-router-dom";
import emptyImage from "~/assets/images/furina/catSad.png";
import {getAllByUser} from "~/services/OrderService";

// const emptyImage = require("~/assets/images/furina/catSad.png");


function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showOrderId, setShowOrderId] = useState(false);
    const navigate = useNavigate();
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
            title: 'ID',
            dataIndex: 'orderInfo',
            key: 'orderInfo',
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
            sorter: (a, b) => a.totalPrice - b.totalPrice,
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
            title: 'Mã sản phẩm',
            dataIndex: 'productId',
            key: 'productId',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (value) => `${Number(value).toLocaleString('vi-VN')} đ`,
        },
        {
            title: 'Tổng',
            key: 'total',
            render: (_, record) => `${Number(record.quantity * record.price).toLocaleString('vi-VN')} đ`,
        },
    ]

    const filteredOrders = orders.filter(order =>
        order.orderInfo.toLowerCase().includes(searchText.toLowerCase())
    );


    const getOrderHistory = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        await getAllByUser(token.access_token).then((res) => {
            setOrders(res.data);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
    };

    const handleToggleOrderId = () => {
        setShowOrderId(!showOrderId);
    }
    useEffect(() => {
        getOrderHistory().then(r => r)
    }, []);

    return (
        <>
            <Card loading={loading} className="shadow-lg border border-gray-200 rounded-lg">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center">
                        <Empty
                            image={emptyImage}
                            styles={{
                                image: {
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: "5px auto",
                                }
                            }}
                            description={
                                <Typography.Text>
                                    Danh sách đơn hàng của bạn trống.
                                </Typography.Text>
                            }>
                            <Button
                                color={'default'}
                                variant={'solid'}
                                // className="mt-4 transition-all"
                                onClick={() => navigate("/")}
                            >
                                Tới trang đặt hàng
                            </Button>
                        </Empty>

                    </div>
                ) : (
                    <div>
                        <Input
                            placeholder="Tìm kiếm mã đơn hàng"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="mb-4 w-64"
                        />
                        <Table
                            columns={columns}
                            dataSource={filteredOrders}
                            rowKey="id"
                            className="overflow-x-auto"
                            pagination={true}
                        />
                    </div>
                )}
            </Card>
            <Modal
                title={`Chi tiết đơn hàng ${selectedOrder?.orderInfo}`}
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Đóng
                    </Button>
                ]}
                width={800}
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><strong>Mã đơn hàng:</strong> {selectedOrder.orderInfo}</p>
                                <p><strong>Tổng
                                    tiền:</strong> {Number(selectedOrder.totalPrice).toLocaleString('vi-VN')} đ</p>
                                <p><strong>Tổng sản phẩm:</strong> {selectedOrder.totalProduct} quyển</p>
                            </div>
                            <div>
                                <p><strong>Trạng thái: </strong>
                                    <Tag color={statusMapping[selectedOrder.status]?.color}>
                                        {statusMapping[selectedOrder.status]?.label}
                                    </Tag>
                                </p>
                                <div className="flex items-center gap-2">
                                    <strong>ID đơn hàng:</strong>
                                    {showOrderId ? (
                                        <div className="flex items-center gap-2">
                                            <Tooltip title={selectedOrder.id}>
                                                <span className="max-w-[200px] truncate text-blue-600">
                                                    {selectedOrder.id}
                                                </span>
                                            </Tooltip>
                                            <Button
                                                size="small"
                                                type="link"
                                                danger
                                                onClick={handleToggleOrderId}
                                            >
                                                Ẩn
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            size="small"
                                            type="link"
                                            onClick={handleToggleOrderId}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Hiện ID
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Chi tiết sản phẩm</h3>
                            <Table
                                dataSource={selectedOrder.orderDetails}
                                columns={columnDetails}
                                pagination={false}
                                rowKey="id"
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </>
    )
}

export default OrderHistory;