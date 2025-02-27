import {useState} from "react";
import {Menu} from "antd";
import Sider from "antd/es/layout/Sider";

function AdminSideBar({onSelect, menuItems}) {
    const [collapsed, setCollapsed] = useState(false);
    const siderStyle = {
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
    };

    return (
        <Sider style={siderStyle} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="h-12 bg-dark text-white flex items-center justify-center text-lg font-bold">
                {collapsed ? <a onClick={() => onSelect('1')}>BS</a> : <a onClick={() => onSelect('1')}>BookStore</a>}
            </div>
            <Menu theme="dark" mode="inline" items={menuItems} onClick={(e) => onSelect(e.key)}/>
        </Sider>
    );
}

export default AdminSideBar;