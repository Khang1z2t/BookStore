import React, {useState} from 'react';
import {Breadcrumb, Layout, Menu, theme} from 'antd';

import {Link} from 'react-router-dom';
import AdminSideBar from "~/components/Layout/components/AdminSideBar";
import AdminHeader from "~/components/Layout/components/AdminHeader";
import AdminFooter from "~/components/Layout/components/AdminFooter";

const {Content} = Layout;


function AdminLayout({children, breadcrumbItems, menuItems, handleMenuSelect}) {

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const header = (
        <>
            <div className={'flex items-center justify-between gap-4'}>
                <h2 className={'text-lg font-semibold'}>Admin Dashboard</h2>
                <Link className={'text-blue-500'} to={'/'}>Go back to User HomePage</Link>
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
                        <Breadcrumb.Item>{breadcrumbItems}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={`p-4 ${colorBgContainer} ${borderRadiusLG}`}>{children}</div>
                </Content>
                <AdminFooter children={'Pacific ©2025 Created by Pacific Team'}/>
            </Layout>
        </Layout>
    )
}

export default AdminLayout;