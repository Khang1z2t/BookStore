import {useState, useEffect, useRef} from "react";
import {Button, Card, Row, Col, Typography, message, InputNumber, Table, Image, Spin} from "antd";
import {UserOutlined, PercentageOutlined, GiftOutlined, LoadingOutlined, DeleteOutlined} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import {findProductById} from "~/services/ProductService";
import {createOrder} from "~/services/OrderService";
import {useAlerts} from "~/context/AlertsContext";
import {deleteCartByUser, deleteCartItem, getCart, updateCartItem} from "~/services/CartService";
import {useCart} from "~/context/CartContext";
import emptyImage from "~/assets/images/furina/catSad.png";


const {Title, Text} = Typography;

function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0);
    const [loadingItems, setLoadingItems] = useState({});
    const {showAlert} = useAlerts();
    const {updateCartCount, cartCount} = useCart();
    const navigate = useNavigate();
    const updateTimeoutRef = useRef(null);
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
        // setLoading(true);
        try {
            const cartResponse = await getCart();
            const storedCart = cartResponse.data.items || [];

            if (storedCart.length === 0) {
                setCart([]);
                setTotalPrice(0); // Đặt tổng tiền về 0 nếu giỏ hàng trống
                return;
            }

            // Gọi API lấy thông tin từng sản phẩm theo ID (dùng Promise.allSettled để tránh lỗi làm mất dữ liệu)
            const updatedCartResults = await Promise.allSettled(
                storedCart.map(async (item) => {
                    try {
                        const product = await fetchProductById(item.productId);
                        return product
                            ? {...product, id: item.id, productId: product.id, quantity: item.quantity}
                            : null;
                    } catch (error) {
                        console.error(`Lỗi lấy sản phẩm ${item.productId}:`, error);
                        return null; // Không làm crash toàn bộ giỏ hàng
                    }
                })
            );

            // Lọc sản phẩm hợp lệ
            const validCart = updatedCartResults
                .filter(result => result.status === "fulfilled" && result.value !== null)
                .map(result => result.value);

            setCart(validCart);

            setTotalPrice(validCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
        } catch (error) {
            console.error("Lỗi khi tải giỏ hàng:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadCart().then(r => r);
    }, [cartCount]);

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
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === cartItemId ? {...item, quantity: quantity} : item
            )
        );

        setTotalPrice((prevTotal) =>
            prevTotal + cart.find(item => item.id === cartItemId)?.price * (quantity - cart.find(item => item.id === cartItemId)?.quantity || 0)
        );

        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = setTimeout(async () => {
            try {
                await updateCartItem({cartItemId, quantity});
            } catch (e) {
                console.log(e);
            } finally {
                updateCartCount();
            }
        }, 500);

    };

    const handleOrder = async () => {
        try {
            navigate("/confirm-order", {state: {cartItems: cart}})
        } catch (error) {
            console.log(error);
        } finally {
            setOrderLoading(false);
            updateCartCount();
            // showAlert("Đã xác nhận đơn hàng!", "success");
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
                                src={emptyImage}
                                alt="Empty cart"
                                className="w-48 h-48 mt-4 rounded-md"
                            />
                            <Link to="/">
                                <Button color={"default"} variant={"solid"}
                                        className="mt-4">Tiếp tục mua sắm</Button>
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