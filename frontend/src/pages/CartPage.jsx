import {useState, useEffect} from "react";
import {Button, Card, Row, Col, Typography, message, InputNumber, Table, Image, Spin} from "antd";
import {UserOutlined, PercentageOutlined, GiftOutlined, LoadingOutlined, DeleteOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {findProductById} from "~/services/ProductService";
import {createOrder} from "~/services/OrderService";
import {useAlerts} from "~/context/AlertsContext";
import {deleteCartByUser, deleteCartItem, getCart, updateCartItem} from "~/services/CartService";
import {useCart} from "~/context/CartContext";


const {Title, Text} = Typography;

function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0);
    const [loadingItems, setLoadingItems] = useState({});
    const {showAlert} = useAlerts();
    const {updateCartCount, cartCount} = useCart();
    const columns = [
        {
            title: "Hình ảnh",
            dataIndex: "imageUrl",
            render: (text) =>
                <Image.PreviewGroup>
                    <Image src={`https://lh3.googleusercontent.com/d/${text}`} width={80}
                           height={100}/></Image.PreviewGroup>,
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
            title: "Số lượng",
            dataIndex: "quantity",
            render: (text, record) => (
                <InputNumber min={1} value={text} onChange={
                    (value) => updateQuantity(record.id, value)}/>
            ),
        },
        {
            title: "Tổng tiền",
            render: (_, record) => <span>{(record.price * record.quantity).toLocaleString("vi-VN")} đ</span>,
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Button color="danger" variant="filled"
                        onClick={() => removeItem(record.id)}
                        icon={<DeleteOutlined/>}
                        loading={loadingItems[record.id]}>
                    Xóa
                </Button>
            ),
        },];
    const fetchProductById = async (id) => {
        try {
            const response = await findProductById(id);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const loadCart = async () => {
        setLoading(true);
        try {
            const cartResponse = await getCart();
            const storedCart = cartResponse.data.items || [];

            if (storedCart.length === 0) {
                setCart([]);
                setLoading(false);
                return;
            }

            // Gọi API lấy thông tin từng sản phẩm theo ID
            const updatedCart = await Promise.all(
                storedCart.map(async (item) => {
                    // Giả sử fetchProductById trả về response chứa data
                    const product = await fetchProductById(item.productId);
                    return product ? {
                        ...product,
                        id: item.id,
                        productId: product.id,
                        quantity: item.quantity
                    } : null;
                })
            );

            // Loại bỏ sản phẩm null (nếu API lỗi hoặc không tìm thấy)
            const validCart = updatedCart.filter((item) => item !== null);
            setCart(validCart);
            // Tính tổng tiền
            const total = validCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setTotalPrice(total);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart().then(r => r);
    }, [cartCount]);

    // Xóa sản phẩm khỏi giỏ hàng
    const removeItem = async (id) => {
        setLoadingItems((prev) => ({...prev, [id]: true}));
        try {
            await deleteCartItem(id)
            const updatedCart = cart.filter((item) => item.id !== id);
            setCart(updatedCart);

            const total = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setTotalPrice(total);

            showAlert("Đã xóa sản phẩm khỏi giỏ hàng!", "success");
        } catch (e) {
            console.log(e)
        } finally {
            updateCartCount()
            setLoadingItems((prev) => ({...prev, [id]: false}));
        }
    };

    // Cập nhật số lượng sản phẩm
    const updateQuantity = async (cartItemId, quantity) => {
        try {
            await updateCartItem({cartItemId, quantity});
            const updatedCart = cart.map((item) =>
                item.id === cartItemId ? {...item, quantity} : item
            );
            setCart(updatedCart);

            // Tính lại tổng
            const total = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setTotalPrice(total);
        } catch (e) {

        } finally {
            updateCartCount()
        }
    };

    const handleOrder = async () => {
        setOrderLoading(true);
        const orderPayload = {
            orderDetails: cart.map(({productId, quantity}) => ({
                productId,
                quantity
            }))
        };
        try {
            await createOrder(orderPayload);
            message.success("Đã xác nhận đơn hàng!").then(r => r);
            await deleteCartByUser()
        } catch (error) {
            console.log(error);
        } finally {
            setOrderLoading(false);
            updateCartCount();
            showAlert("Đã xác nhận đơn hàng!", "success");
        }
    }

    return (
        <div className="container mx-auto p-6">
            {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                    <Spin indicator={<LoadingOutlined className={'text-black'} spin/>} size="large"/>
                </div>
            ) : cart.length === 0 ? (
                <Card className="bg-gray-50 p-10 rounded-lg">
                    <Row gutter={[32, 32]} align="middle">
                        {/* Cột hiển thị hình ảnh và thông báo */}
                        <Col xs={24} md={16} className="flex flex-col items-center">
                            <Title level={3}>Giỏ hàng trống!</Title>
                            <Text type="secondary">
                                Thêm sản phẩm vào giỏ và quay lại trang này để thanh toán nha bạn ❤️
                            </Text>
                            <img
                                src="https://img.itch.zone/aW1nLzUxMjk1NDYuanBn/original/nrtGQr.jpg"
                                alt="Empty cart"
                                className="w-48 h-48 mt-4 rounded-md"
                            />
                            <Link to="/">
                                <Button type="primary" className="mt-4">Tiếp tục mua sắm</Button>
                            </Link>
                        </Col>

                        {/* Cột hiển thị ưu đãi */}
                        <Col xs={24} md={8}>
                            <Card className="shadow-lg">
                                <Row gutter={[16, 16]} align="middle">
                                    <Col span={2}>
                                        <UserOutlined className="text-xl text-gray-500"/>
                                    </Col>
                                    <Col span={22}>
                                        <Text className="text-gray-700">Bạn có mã giới thiệu?</Text>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 16]} align="middle" className="mt-4">
                                    <Col span={2}>
                                        <PercentageOutlined className="text-xl text-gray-500"/>
                                    </Col>
                                    <Col span={22}>
                                        <Text className="text-gray-700">Bạn có mã ưu đãi?</Text>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 16]} align="middle" className="mt-4">
                                    <Col span={2}>
                                        <GiftOutlined className="text-xl text-gray-500"/>
                                    </Col>
                                    <Col span={22}>
                                        <Text className="text-gray-700">Bạn muốn tặng cho bạn bè?</Text>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            ) : (
                <Card className="p-6">
                    <Row gutter={[32, 32]}>
                        {/* Cột hiển thị danh sách sản phẩm */}
                        <Col xs={24} md={16}>
                            <Title level={3}>Giỏ hàng của bạn</Title>
                            <Table columns={columns} dataSource={cart} loading={loading} rowKey="id"
                                   pagination={false}/>
                        </Col>

                        {/* Cột hiển thị tổng tiền và nút xác nhận */}
                        <Col xs={24} md={8}>
                            <Card className="shadow-lg p-6">
                                <Title level={4}>Tóm tắt đơn hàng</Title>
                                <Row gutter={[16, 16]} align="middle">
                                    <Col span={2}>
                                        <UserOutlined className="text-xl text-gray-500"/>
                                    </Col>
                                    <Col span={22}>
                                        <Text className="text-gray-700">Bạn có mã giới thiệu?</Text>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 16]} align="middle" className="mt-4">
                                    <Col span={2}>
                                        <PercentageOutlined className="text-xl text-gray-500"/>
                                    </Col>
                                    <Col span={22}>
                                        <Text className="text-gray-700">Bạn có mã ưu đãi?</Text>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 16]} align="middle" className="mt-4">
                                    <Col span={2}>
                                        <GiftOutlined className="text-xl text-gray-500"/>
                                    </Col>
                                    <Col span={22}>
                                        <Text className="text-gray-700">Bạn muốn tặng cho bạn bè?</Text>
                                    </Col>
                                </Row>
                                <div className="mt-6 text-right">
                                    <Title level={4}>Tổng tiền: {totalPrice.toLocaleString("vi-VN")} đ</Title>
                                    <Button color="default" variant="solid" className="mt-4 w-full"
                                            loading={orderLoading}
                                            onClick={handleOrder}>Xác nhận thanh
                                        toán</Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            )}
        </div>
    )
}

export default CartPage;