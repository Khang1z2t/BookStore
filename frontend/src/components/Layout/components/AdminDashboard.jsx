import {StatusCard} from "~/components/Layout/components/StatusCard";
import {ChartCard} from "~/components/Layout/components/ChartCard";
import {StatisticSection} from "~/components/Layout/components/Sections/StatisticSection";

function AdminDashboard() {
    const chartData = [
        { name: 'Mon', value: 1200 },
        { name: 'Tue', value: 2100 },
        { name: 'Wed', value: 800 },
        { name: 'Thu', value: 1600 },
        { name: 'Fri', value: 2400 },
        { name: 'Sat', value: 1800 },
        { name: 'Sun', value: 2200 },
    ];

    return (
        <div className={"space-y-4"}>
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
                {/*Tổng Lợi nhuận được so sánh theo chu kì*/}
                <StatusCard title={'Total Sales'}
                            totalAmount={123456}
                            weekChange={{ value: 12, type: 'increase' }}
                            dayChange={{ value: 2, type: 'decrease' }}
                            dailyAmount={1234}
                />
                {/*Thống kê lượt truy cập*/}
                <StatusCard
                    title="支付笔数"
                    totalAmount="6,560"
                    dailyAmount="转化率 60%"
                    weekChange={{ value: 0, type: 'neutral' }}
                    dayChange={{ value: 0, type: 'neutral' }}
                />
                {/*sơ đồ thống kê theo null*/}
                <ChartCard
                    title="Doanh thu tuần"
                    totalAmount="¥ 126,560"
                    weekChange={{ value: 12, type: 'increase' }}
                    dayChange={{ value: 11, type: 'decrease' }}
                    dailyAmount="¥ 12,423"
                    chartData={chartData}
                    chartType="line" // Hoặc "bar"
                />
            </div>
            {/*Thống kê doanh thu theo tháng/năm*/}
            <StatisticSection />
            {/*Số lượng được đặt như thế nào trong các tour*/}
        </div>
    );
}

export default AdminDashboard;