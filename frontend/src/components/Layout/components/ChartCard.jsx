import React from 'react';
import { Card } from 'antd';
import { Info, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ChartCard = ({ title, totalAmount, weekChange, dayChange, dailyAmount, chartData, chartType = 'line' }) => {
    return (
        <Card className="w-full shadow-md" bordered={true}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">{title}</span>
                <Info className="text-gray-400" size={16} />
            </div>
            <h2 className="text-3xl font-bold">{totalAmount}</h2>
            <div className="w-full h-24">
                <ResponsiveContainer width="100%" height={100}>
                    {chartType === 'bar' ? (
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" hide />
                            <YAxis hide />
                            <Tooltip />
                            <Bar dataKey="value" fill="#6366F1" />
                        </BarChart>
                    ) : (
                        <LineChart data={chartData}>
                            <XAxis dataKey="name" hide />
                            <YAxis hide />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} dot={false} />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
            <hr className="my-2" />
            <div className="text-gray-600 text-sm">日访问量 {dailyAmount}</div>
        </Card>
    );
};