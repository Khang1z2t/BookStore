import React, {useState} from "react";
import {
    BellOutlined,
    BlockOutlined,
    BuildOutlined,
    DesktopOutlined,
    FileOutlined,
    LockOutlined,
    LogoutOutlined,
    MoneyCollectOutlined,
    PaperClipOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Link} from "react-router-dom";

import AdminSideBar from "~/components/Layout/components/AdminSideBar";
import {Breadcrumb, Layout, theme} from "antd";
import AdminHeader from "~/components/Layout/components/AdminHeader";
import AdminFooter from "~/components/Layout/components/AdminFooter";
import AdminDashboard from "~/components/Layout/components/AdminDashboard"
import AdminUser from "~/components/Layout/components/AdminUser";
import {BookOutlined} from "@mui/icons-material";
import AdminBook from "~/components/Layout/components/AdminBook";

const {Content} = Layout;

function AdminPage() {
    const menuItems = [
        {label: 'Dashboard', key: '1', icon: <DesktopOutlined/>, content: <AdminDashboard/>},
        {label: 'User', key: '2', icon: <UserOutlined/>, content: <AdminUser/>},
        {label: 'Book', key: '3', icon: <BookOutlined/>, content: <AdminBook/>},
    ]

    const [selectedContent, setSelectedContent] = useState(menuItems[0].content);
    const [selectedLabel, setSelectedLabel] = useState(menuItems[0].label);

    const handleMenuSelect = (key) => {
        const selectedItem = menuItems.flatMap(item => item.children || item)
            .find(item => item.key === key);
        setSelectedContent(selectedItem ? selectedItem.content : 'Content not found');
        setSelectedLabel(selectedItem ? selectedItem.label : 'Label not found');
    };
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const header = (
        <>
            <div className={'flex items-center justify-between gap-4'}>
                <h2 className={'text-lg font-semibold'}>Admin Dashboard</h2>
                <Link className={'text-blue-500'} to={'/'}>Go back to HomePage</Link>
            </div>
        </>
    )
    return (
        <Layout className={'min-h-screen bg-gray-100'}>
            <AdminSideBar onSelect={handleMenuSelect} menuItems={menuItems}/>
            <Layout className="site-layout">
                <AdminHeader children={header}/>
                <Content className="p-4">
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>{selectedLabel}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={`p-4 ${colorBgContainer} ${borderRadiusLG}`}>{selectedContent}</div>
                </Content>
                <AdminFooter children={'Pacific ©2025 Created by Pacific Team'}/>
            </Layout>
        </Layout>

    )
}

export default AdminPage