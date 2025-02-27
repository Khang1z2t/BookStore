import React from 'react';
import { Card } from 'antd';
import { InfoCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export const StatusCard = ({ title, totalAmount, weekChange, dayChange, dailyAmount }) => {
    return (
        <Card className="w-full shadow-md" bordered={true}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{title}</span>
                <InfoCircleOutlined className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold">¥ {totalAmount}</h2>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>
                    周同比 {weekChange.value}% {weekChange.type === 'increase' ? <ArrowUpOutlined className="text-red-500" /> : <ArrowDownOutlined className="text-green-500" />}
                </span>
                <span>
                    日同比 {dayChange.value}% {dayChange.type === 'increase' ? <ArrowUpOutlined className="text-red-500" /> : <ArrowDownOutlined className="text-green-500" />}
                </span>
            </div>
            <div className={"absolute bottom-6 min-w-96"}>
                <hr className="my-2" />
                <div className="text-gray-600 ">日销售额 ¥ {dailyAmount}</div>
            </div>
        </Card>
    );
};