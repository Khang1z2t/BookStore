import {Col, List, Row} from "antd";
import BookCard from "~/components/Book/BookCard";


function BookList({ books, onBuy, onAddToCart }) {
    return (
        <Row justify="center" align="top">
            {books.map((book) => (
                <Col key={book.id} xs={24} sm={12} md={8} lg={6} className="flex">
                    <BookCard book={book} onBuy={onBuy} onAddToCart={onAddToCart}  />
                </Col>
            ))}
        </Row>
    );
}
export default BookList;