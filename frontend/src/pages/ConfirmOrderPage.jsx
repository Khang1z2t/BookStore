import {Button, Card, Col, message, Radio, Row, Spin, Table, Typography} from "antd";
import {useEffect, useState} from "react";
import {CheckCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import GoogleImage from "~/components/GoogleImage";
import {findProductById} from "~/services/ProductService";
import {useLocation, useNavigate} from "react-router-dom";
import {createOrder} from "~/services/OrderService";
import {deleteCartByUser} from "~/services/CartService";
import {useAlerts} from "~/context/AlertsContext";
import {useCart} from "~/context/CartContext";

const {Title, Text} = Typography;

function ConfirmOrderPage() {
    const location = useLocation();
    const {cartItems = [], singleProductId = null} = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [orderDetails, setOrderDetails] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);
    const {showAlert} = useAlerts();
    const {updateCartCount, cartCount} = useCart();
    const navigate = useNavigate();
    const CustomSpin = <Spin indicator={<LoadingOutlined style={{fontSize: 24, color: '#000'}} spin/>}/>;
    const columns = [
        {title: "STT", dataIndex: "index", key: "index", render: (_, __, i) => i + 1},
        {
            title: 'Ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (text) => <GoogleImage width={100} imageId={text}/> || 'Chưa có',
        },
        {title: "Sản phẩm", dataIndex: "name", key: "name"},
        {title: "Số lượng", dataIndex: "quantity", key: "quantity", render: (value) => `${value} quyển`},
        {
            title: "Giá", dataIndex: "price", key: "price",
            render: (value) => {
                if (!value) return 'Chưa có';
                return `${Number(value).toLocaleString('vi-VN')} đ`;
            },
        },
        {
            title: 'Tổng tiền', key: 'tPrice', render: (_, record) => {
                const total = record.price * record.quantity;
                return total ? `${Number(total).toLocaleString('vi-VN')} đ` : 'Chưa có';
            }
        }
    ];

    const fetchProductById = async (id) => {
        try {
            const response = await findProductById(id);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const loadOrderDetails = async () => {
        try {
            let productList = []

            if (singleProductId) {
                const product = await fetchProductById(singleProductId);
                if (product) {
                    productList = [{...product, quantity: 1}];
                }
            } else {
                const products = await Promise.all(
                    cartItems.map(async (item) => {
                        const product = await fetchProductById(item.productId);
                        return product ? {...product, quantity: item.quantity} : null;
                    })
                );

                // Loại bỏ sản phẩm không hợp lệ (nếu API lỗi)
                productList = products.filter((item) => item !== null);
            }

            setOrderDetails(productList)
            const totalPrice = productList.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setTotalPrice(totalPrice);

        } catch (error) {
            console.error("Lỗi khi load sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleOrder = async () => {
        setOrderLoading(true);
        const orderPayload = {
            orderDetails: orderDetails.map((item) => ({
                productId: item.id ?? item.productId,
                quantity: item.quantity
            }))
        };
        try {
            await createOrder(orderPayload);
            showAlert("Đã xác nhận đơn hàng!", "success");
            if (cartItems.length > 0) {
                await deleteCartByUser();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setOrderLoading(false);
            updateCartCount();
            navigate("/profile")
        }
    }


    useEffect(() => {
        loadOrderDetails().then(r => r);
    }, [JSON.stringify(cartItems), singleProductId]);

    return (
        <div className="container mx-auto p-6">
            <Card className="p-6 shadow-lg">
                <Title level={3}>Xác nhận đơn hàng</Title>

                <Table columns={columns} dataSource={orderDetails}
                       loading={loading ? {indicator: CustomSpin} : false} rowKey="id"
                       pagination={false}/>

                <Row className="mt-6">
                    <Col span={24}>
                        <Title level={4}>Chọn phương thức thanh toán</Title>
                        <Radio.Group value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                            <Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio>
                            <Radio value="vnpay">Thanh toán qua VNPAY</Radio>
                        </Radio.Group>
                    </Col>
                </Row>

                <div className="mt-6 text-right">
                    <Title level={4}>Tổng tiền: {totalPrice.toLocaleString("vi-VN")} đ</Title>
                    <Button color="default" variant="solid" size="large" icon={<CheckCircleOutlined/>} className="mt-4"
                            onClick={() => handleOrder()}>
                        Xác nhận đặt hàng
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default ConfirmOrderPage;