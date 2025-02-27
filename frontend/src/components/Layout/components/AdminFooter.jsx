import {Footer} from "antd/es/layout/layout";

function AdminFooter({children}) {
    return (
        <Footer className="text-center text-white-600">{children}</Footer>
    )
}

export default AdminFooter;