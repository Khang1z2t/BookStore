import {Button, Card} from "antd";

const {Meta} = Card;


function BookCard({book, onBuy, onAddToCart, onClick}) {
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
            className="w-full flex flex-col justify-between"
            hoverable
            cover={
                <img
                    alt={bookDefault.name}
                    src={`https://lh3.googleusercontent.com/d/${bookDefault.image}`}
                    className={'object-fill w-auto h-[200px]'}
                />
            }
            onClick={() => onClick(bookDefault.id)}
            style={{ marginBottom: '16px', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
            <Meta
                className={'text-lg uppercase'}
                title={bookDefault.name}
            />
            <Meta
                className={'mt-2 text-end text-sm'}
                title={`${Number(bookDefault.price).toLocaleString('vi-VN')} đ`}/>
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