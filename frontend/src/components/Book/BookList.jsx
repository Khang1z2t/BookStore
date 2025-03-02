import {useState} from "react";
import {Button, Col, Image, InputNumber, List, Modal, Row} from "antd";
import BookCard from "~/components/Book/BookCard";


function BookList({books, onBuy, onAddToCart, onClick}) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Mở popup khi ấn "Thêm giỏ hàng"
    const handleAddToCart = (book) => {
        setSelectedBook(book);
        setQuantity(1);
        setIsModalVisible(true);
    };

    // Lưu vào localStorage
    const handleConfirmAddToCart = () => {
        if (!selectedBook) return;

        // Lấy giỏ hàng từ localStorage (nếu chưa có thì là mảng rỗng)
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        const existingItem = cart.find((item) => item.id === selectedBook.id);
        if (existingItem) {
            existingItem.quantity += quantity; // Cộng dồn số lượng
        } else {
            cart.push({
                id: selectedBook.id,
                quantity
            });
        }

        // Lưu lại vào localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Đóng popup
        setIsModalVisible(false);
    };

    return (
        <>
            <Row justify="start" align="top" gutter={[16, 16]} wrap={true}>
                {books.map((book) => (
                    <Col key={book.id} xs={24} sm={12} md={8} lg={6} style={{display: 'flex'}}>
                        <BookCard book={book} onBuy={onBuy} onAddToCart={() => handleAddToCart(book)}/>
                    </Col>
                ))}
            </Row>
            <Modal
                title="Thêm vào giỏ hàng"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="confirm" type="primary" onClick={handleConfirmAddToCart}>
                        Xác nhận
                    </Button>,
                ]}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '40%',
                }}
            >
                {selectedBook && (
                    <div className="flex flex-col items-center text-center">
                        <Image.PreviewGroup>
                            <Image
                                src={`https://lh3.googleusercontent.com/d/${selectedBook.imageUrl}`}
                                alt={selectedBook.name}
                                width={150}
                                height={200}
                                className="object-cover mb-2 rounded-md"
                            />
                        </Image.PreviewGroup>
                        <h3 className="text-lg font-semibold">{selectedBook.name}</h3>
                        <p className="text-red-500 text-lg">{selectedBook.price.toLocaleString("vi-VN")} đ</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span>Số lượng:</span>
                            <InputNumber min={1} value={quantity} onChange={setQuantity} className="w-20"/>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default BookList;