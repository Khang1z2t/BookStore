import {Header} from "antd/es/layout/layout";

function AdminHeader({children}) {
    return (
        <Header className="bg-white shadow-md px-4 flex items-center text-lg font-semibold">
            {children}
        </Header>
    )
}

export default AdminHeader;