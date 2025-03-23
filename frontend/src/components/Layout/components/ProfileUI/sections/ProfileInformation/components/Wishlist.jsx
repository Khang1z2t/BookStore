import {useState} from "react";
import {Button, Card, Empty, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import emptyImage from "~/assets/images/furina/catSad.png";

function Wishlist() {
    const [wishlist, setWishList] = useState(null);
    const navigate = useNavigate();

    return (
        <Card className="shadow-lg border border-gray-200 rounded-lg">
            {wishlist === null ? (
                <div className="flex flex-col items-center justify-center">
                    <Empty
                        image={emptyImage}
                        styles={{
                            image: {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "5px auto",
                            }
                        }}
                        description={
                            <Typography.Text>
                                Danh sách yêu thích của bạn trống.
                            </Typography.Text>
                        }>
                        <Button
                            color={'default'}
                            variant={'solid'}
                            // className="mt-4 transition-all"
                            onClick={() => navigate("/")}
                        >
                            Tới trang sản phẩm
                        </Button>
                    </Empty>

                </div>
            ) : (
                <div>
                    {/* Đây là nơi hiển thị danh sách đơn hàng sau này */}
                    <p>Đây là danh sách đơn hàng của bạn.</p>
                </div>
            )
            }

        </Card>
    )
}

export default Wishlist;