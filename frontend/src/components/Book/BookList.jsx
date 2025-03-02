import {Col, List, Row} from "antd";
import BookCard from "~/components/Book/BookCard";


function BookList({books, onBuy, onAddToCart, onClick}) {
    return (
        <Row justify="start" align="top" gutter={[16, 16]} wrap={true}>
            {books.map((book) => (
                <Col key={book.id} xs={24} sm={12} md={8} lg={6} style={{display: 'flex'}}>
                    <BookCard book={book} onBuy={onBuy} onAddToCart={onAddToCart} onClick={onClick}/>
                </Col>
            ))}
        </Row>
    );
}

export default BookList;