import {useState, useEffect} from "react";
import {Button, Card, Row, Col, Typography, message, InputNumber, Table, Image, Spin} from "antd";
import {UserOutlined, PercentageOutlined, GiftOutlined, LoadingOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {findProductById} from "~/services/ProductService";
import {createOrder} from "~/services/OrderService";
import {useAlerts} from "~/context/AlertsContext";


const {Title, Text} = Typography;

function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const {showAlert} = useAlerts();
    const columns = [
        {
            title: "Hình ảnh",
            dataIndex: "imageUrl",
            render: (text) => <Image.PreviewGroup><Image src={`https://lh3.googleusercontent.com/d/${text}`} width={80}
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
                <InputNumber min={1} value={text} onChange={(value) => updateQuantity(record.id, value)}/>
            ),
        },
        {
            title: "Tổng tiền",
            render: (_, record) => <span>{(record.price * record.quantity).toLocaleString("vi-VN")} đ</span>,
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Button color="danger" variant="filled" onClick={() => removeItem(record.id)}>
                    Xóa
                </Button>
            ),
        },
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

    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

            if (storedCart.length === 0) {
                setCart([]);
                setLoading(false);
                return;
            }

            try {
                // Gọi API lấy thông tin từng sản phẩm theo ID
                const updatedCart = await Promise.all(
                    storedCart.map(async (item) => {
                        const product = await fetchProductById(item.id);
                        return product ? {...product, quantity: item.quantity} : null;
                    })
                );

                // Loại bỏ sản phẩm null (nếu API lỗi hoặc không tìm thấy)
                const validCart = updatedCart.filter((item) => item !== null);
                setCart(validCart);
                setLoading(false);

                // Tính tổng tiền
                const total = validCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                setTotalPrice(total);
            } catch (error) {
                console.error(error);
            }
        };

        loadCart().then(r => r);
    }, []);

    // Xóa sản phẩm khỏi giỏ hàng
    const removeItem = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart.map(({id, quantity}) => ({id, quantity}))));
        message.success("Đã xóa sản phẩm khỏi giỏ hàng!").then(r => r);
    };

    // Cập nhật số lượng sản phẩm
    const updateQuantity = (id, quantity) => {
        const updatedCart = cart.map((item) =>
            item.id === id ? {...item, quantity: quantity} : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart.map(({id, quantity}) => ({id, quantity}))));

        // Cập nhật tổng tiền
        const total = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const handleOrder = async () => {
        setLoading(true);

        const orderPayload = {
            orderDetails: cart.map(({id, quantity}) => ({
                productId: id,
                quantity
            }))
        };
        console.log("orderPayload", orderPayload);
        try {
            const response = await createOrder(orderPayload);

            if (response) {
                message.success("Đã xác nhận đơn hàng!").then(r => r);
                localStorage.removeItem("cart");
                setCart([]);
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi khi xác nhận đơn hàng!").then(r => r);
        } finally {
            setLoading(false);
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