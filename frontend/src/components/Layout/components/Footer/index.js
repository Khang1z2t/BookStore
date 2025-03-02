import { Layout } from "antd";

const { Footer } = Layout;

function AppFooter() {
    return (
        <Footer className="bg-black text-white text-center p-6">
            <div className="container mx-auto">
                <p className="text-lg font-semibold">© 2025 BookStore. All rights reserved.</p>
                <div className="mt-2 flex justify-center gap-4">
                    <a href="#" className="hover:text-gray-400">Chính sách bảo mật</a>
                    <a href="#" className="hover:text-gray-400">Điều khoản sử dụng</a>
                    <a href="#" className="hover:text-gray-400">Liên hệ</a>
                </div>
            </div>
        </Footer>
    );
}

export default AppFooter;
