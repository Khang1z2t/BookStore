import {Button, Result} from "antd";
import {Link} from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Result
                status="404"
                title="404"
                subTitle="Oops! Trang bạn tìm kiếm không tồn tại."
                extra={
                    <Link to="/">
                        <Button color="default" variant="solid" >
                            Quay lại Trang chủ
                        </Button>
                    </Link>
                }
            />
        </div>
    );
}

export default NotFoundPage;
