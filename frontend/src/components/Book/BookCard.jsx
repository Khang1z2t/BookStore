import {Button, Card} from "antd";

const {Meta} = Card;


function BookCard({book, onBuy, onAddToCart}) {
    const bookDefault = {
        id: book.id || '',
        name: book.name || '',
        description: book.description || '',
        image: book.imageUrl || '',
        price: book.price || 0,
        quantity: book.quantity || 0,
    }
    return (
        <Card
            className="w-full"
            hoverable
            cover={
                <img
                    alt={bookDefault.name}
                    src={`https://drive.google.com/thumbnail?id=${bookDefault.image}`}
                    style={{height: '200px', objectFit: 'cover'}}

                />
            }
            style={{marginBottom: '16px'}}
        >
            <Meta
                className={'text-lg uppercase'}
                title={bookDefault.name}
            />
            <Meta
                className={'mt-2 text-end text-sm'}
                title={`${Number(bookDefault.price).toLocaleString('vi-VN')} đ`} />
            <div style={{marginTop: 16, display: 'flex', justifyContent: 'space-between'}}>
                <Button color="default" variant="solid" onClick={() => onBuy(bookDefault.id)}>
                    Mua
                </Button>
                <Button onClick={() => onAddToCart(bookDefault.id)}>
                    Thêm giỏ hàng
                </Button>
            </div>
        </Card>
    );
}

export default BookCard;