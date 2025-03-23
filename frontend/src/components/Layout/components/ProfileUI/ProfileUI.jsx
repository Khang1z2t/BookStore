import {Card, DatePicker, Input, Spin, Tabs, Typography} from 'antd';
import {useState} from 'react';
import {ProfileCard} from "~/components/Layout/components/ProfileUI/components/ProfileCard";
import {EmptyProfileCard} from "~/components/Layout/components/ProfileUI/components/EmptyProfileCard";
import {
    ProfileInformation
} from "~/components/Layout/components/ProfileUI/sections/ProfileInformation/ProfileInformation";
import {
    AccountSecurity
} from "~/components/Layout/components/ProfileUI/sections/ProfileInformation/components/AccountSecurity";
import {useAuth} from "~/context/AuthContext";
import {Box, CircularProgress} from "@mui/material";
import {LoadingOutlined} from "@ant-design/icons";
import OrderHistory from "~/components/Layout/components/ProfileUI/sections/ProfileInformation/components/OrderHistory";
import Wishlist from "~/components/Layout/components/ProfileUI/sections/ProfileInformation/components/Wishlist";


const {TabPane} = Tabs;
export const ProfileUI = () => {
    const {currentUser} = useAuth();
    const [active, setActive] = useState(true);
    const [activeTab, setActiveTab] = useState('1');

    return (
        <>
            {!currentUser ? (
                <div className="flex justify-center items-center h-[400px]">
                    <Spin indicator={<LoadingOutlined className={'text-black'} spin/>} size="large"/>
                </div>
            ) : (
                <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">
                    {/* Sidebar */}
                    <div className="w-1/4">
                        {currentUser ? (
                            <ProfileCard data={currentUser} setActiveTab={setActiveTab}/>
                        ) : (
                            <EmptyProfileCard/>
                        )}
                    </div>
                    {/* Main Content */}
                    {currentUser ? (
                        <div className="flex-1">
                            <div className="flex-1">
                                <Tabs
                                    rootClassName="bg-white p-4 rounded-lg shadow-md border border-gray-300"
                                    activeKey={activeTab}
                                    onChange={(key) => setActiveTab(key)}
                                    tabBarStyle={{borderBottom: "1px solid #ddd"}} // Viền dưới nhẹ
                                >
                                    <TabPane tab={<span className="text-black font-medium">Lịch sử đặt hàng</span>}
                                             key="1">
                                        <OrderHistory />
                                    </TabPane>

                                    <TabPane tab={<span className="text-black font-medium">Sách yêu thích</span>}
                                             key="2">
                                        <Wishlist />
                                    </TabPane>

                                    <TabPane tab={<span className="text-black font-medium">Chỉnh sửa thông tin</span>}
                                             key="3">
                                        <ProfileInformation/>
                                    </TabPane>

                                    <TabPane tab={<span className="text-black font-medium">Bảo mật tài khoản</span>}
                                             key="4">
                                        <AccountSecurity/>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                height: '90vh',
                                width: '100%'
                            }}
                        >
                            <CircularProgress color="inherit"/>
                            <Typography pt="10px" fontWeight="600" sx={{userSelect: 'none'}}>
                                Loading, Please Login ...
                            </Typography>
                        </Box>)}
                </div>
            )}
        </>

    );
};