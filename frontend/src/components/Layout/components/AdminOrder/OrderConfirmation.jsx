import {useEffect, useState} from "react";

import {Table, Button, Typography, Spin, Alert, Card, Modal, Form, Input, message, Tag} from 'antd';
import {ExclamationCircleOutlined, LoadingOutlined, ReloadOutlined} from "@ant-design/icons";
import {useAlerts} from "~/context/AlertsContext";
import {getAllOrderByStatus, receiveOrder} from "~/services/OrderService";
import {OrderStatus} from "~/utils/OrderStatus";

const {Title} = Typography;


function OrderConfirmation() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true);
    const [confirmLoading, setConfirmLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [error, setError] = useState(null);
    const {showAlert} = useAlerts();
    const [visible, setVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            // index + 1 để đánh số thứ tự
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Order Number',
            dataIndex: 'orderInfo',
            key: 'orderInfo'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) =>
                status === "PENDING" ? <Tag color="gold">Đang Chờ Xác Nhận</Tag> : status,
        },
        {
            title: 'Total Product',
            dataIndex: 'totalItem',
            key: 'totalItem',
            render: (value) => {
                if (!value) return 'Chưa có'
                return `${value} sản phẩm`;
            },
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (value) => {
                if (!value) return 'Chưa có';
                return `${Number(value).toLocaleString('vi-VN')} đ`;
            },
        },
        {
            title: "Hành Động",
            key: "action",
            render: (_, record) => (
                <Button type="primary" onClick={() => showConfirmModal(record)}>
                    Xác nhận
                </Button>
            ),
        },
    ]

    const fetchOrder = async () => {
        setTableLoading(true);
        try {
            const response = await getAllOrderByStatus(OrderStatus.PENDING)
            setOrders(response.data)
        } catch (e) {
            showAlert("Không thể lấy đơn hàng", 'error')
        } finally {
            setLoading(false);
            setTableLoading(false);
        }
    }

    useEffect(() => {
        fetchOrder().then(response => response)
    }, []);

    const handleConfirmOrder = async () => {
        if (!selectedOrder) return;
        setConfirmLoading(true);
        try {
            await receiveOrder(selectedOrder.id);

            setOrders(orders.filter(order => order.id !== selectedOrder.id));
        } catch (e) {
            console.log(e)
        } finally {
            setVisible(false);
            setConfirmLoading(false)
            showAlert(`Xác nhận đơn hàng ${selectedOrder.orderInfo} thành công`, "success");
        }
    }

    const showConfirmModal = (order) => {
        setSelectedOrder(order);
        setVisible(true);
        setConfirmLoading(false)
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
                    Danh Sách Đơn Hàng Đang Chờ Xác Nhận
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


            {loading && <LoadingOutlined/>}
            {error && <Alert message={error} type="error" showIcon/>}

            {!loading && !error && (
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    pagination={{pageSize: 10}}
                />
            )}

            <Modal
                title="Xác nhận đơn hàng"
                open={visible}
                onCancel={() => setVisible(false)}
                onOk={handleConfirmOrder}
                okText="Xác nhận"
                cancelText="Hủy"
                confirmLoading={confirmLoading}
                centered
            >
                <p>Bạn có chắc chắn muốn xác nhận đơn hàng <b>{selectedOrder?.orderInfo}</b>?</p>
            </Modal>
        </Card>
    )
}

export default OrderConfirmation;