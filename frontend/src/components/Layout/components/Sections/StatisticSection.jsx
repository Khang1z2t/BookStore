import React, { useState } from "react";
import { Card } from "antd";
import { Tabs } from "antd";
import { DatePicker, Table } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const { RangePicker } = DatePicker;

// Dữ liệu doanh số
const salesData = [
    { month: "1月", value: 400 },
    { month: "2月", value: 1000 },
    { month: "3月", value: 1100 },
    { month: "4月", value: 300 },
    { month: "5月", value: 400 },
    { month: "6月", value: 600 },
    { month: "7月", value: 800 },
    { month: "8月", value: 300 },
    { month: "9月", value: 700 },
    { month: "10月", value: 1100 },
    { month: "11月", value: 700 },
    { month: "12月", value: 650 },
];

// Dữ liệu lượt truy cập
const visitData = [
    { month: "1月", value: 500 },
    { month: "2月", value: 800 },
    { month: "3月", value: 900 },
    { month: "4月", value: 400 },
    { month: "5月", value: 500 },
    { month: "6月", value: 700 },
    { month: "7月", value: 900 },
    { month: "8月", value: 350 },
    { month: "9月", value: 600 },
    { month: "10月", value: 1000 },
    { month: "11月", value: 750 },
    { month: "12月", value: 670 },
];

// Bảng doanh số
const salesRanking = [
    { key: "1", rank: 1, name: "工专路 0 号店", value: "323,234" },
    { key: "2", rank: 2, name: "工专路 1 号店", value: "312,432" },
    { key: "3", rank: 3, name: "工专路 2 号店", value: "290,876" },
    { key: "4", rank: 4, name: "工专路 3 号店", value: "250,567" },
    { key: "5", rank: 5, name: "工专路 4 号店", value: "200,321" },
];

// Bảng lượt truy cập
const visitRanking = [
    { key: "1", rank: 1, name: "工专路 0 号店", value: "45,678" },
    { key: "2", rank: 2, name: "工专路 1 号店", value: "42,987" },
    { key: "3", rank: 3, name: "工专路 2 号店", value: "39,654" },
    { key: "4", rank: 4, name: "工专路 3 号店", value: "35,234" },
    { key: "5", rank: 5, name: "工专路 4 号店", value: "30,876" },
];

// Cấu trúc cột cho bảng
const columns = [
    { title: "Số thứ tự", dataIndex: "rank", key: "rank" },
    { title: "Tên tour", dataIndex: "name", key: "name" },
    { title: "Doanh thu", dataIndex: "value", key: "value" },
];

export const StatisticSection = () => {
    const [activeTab, setActiveTab] = useState("1");

    return (
        <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
                <Tabs defaultActiveKey="1" onChange={setActiveTab}>
                    <Tabs.TabPane tab="Theo năm" key="1" />
                    <Tabs.TabPane tab="Theo tháng" key="2" />
                </Tabs>
                <div className="flex space-x-4">
                    <button className="text-gray-500">今天</button>
                    <button className="text-gray-500">本周</button>
                    <button className="text-gray-500">本月</button>
                    <button className="text-gray-500">本年</button>
                    <RangePicker />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {/* Biểu đồ cột */}
                <div className="col-span-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={activeTab === "1" ? salesData : visitData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill={activeTab === "1" ? "#1890ff" : "#ff4d4f"} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Bảng dữ liệu */}
                <div>
                    <h3 className="mb-2 uppercase font-semibold">
                        {activeTab === "1" ? "Danh sách tour được book nhiều nhất" : "Danh sách tour được xem nhiều nhất"}
                    </h3>
                    <Table
                        columns={columns}
                        dataSource={activeTab === "1" ? salesRanking : visitRanking}
                        pagination={false}
                        size="small"
                    />
                </div>
            </div>
        </Card>
    );
};
