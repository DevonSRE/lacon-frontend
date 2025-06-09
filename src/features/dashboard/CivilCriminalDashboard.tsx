import React from "react";
import CaseStatCard from "./components/CaseStatsSummaryChart";

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle: string;
    titleColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, titleColor = "text-gray-500" }) => {
    return (
        <div className="border rounded-xs p-6 space-y-2 shadow-sm bg-white">
            <div className={`text-md font-semibold ${titleColor}`}>{title}</div>
            <div className="text-3xl font-semibold text-black">{value}</div>
            <div className="text-md text-green-400">{subtitle}</div>
        </div>
    );
};

const CivilCriminalDashboard: React.FC = () => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Cases" value="0" subtitle="+23% " />
                <StatCard title="Active Cases" value="0" subtitle="+16%" />
                <StatCard title="Closed Cases" value="0" subtitle="+16%" />
                <StatCard title="Pending Cases" value="0" subtitle="+16%" />
            </div>

            <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Case Stats Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CaseStatCard
                        title="Assigned Cases"
                        value={5}
                        change="+1%"
                        categories={['May', 'June', 'April', 'July', 'August', 'September']}
                        data={[10, 15, 18, 22, 20, 28]}
                        orientation="horizontal"
                        cardBg="bg-red-50"
                        barColor="#BD2B12"
                    />
                    <CaseStatCard
                        title="Pending Cases"
                        value={15}
                        change="+2%"
                        categories={['July', 'April', 'August', 'September', 'May', 'June']}
                        data={[18, 13, 7, 5, 3, 1]}
                        orientation="vertical"
                        cardBg="bg-red-50"
                        barColor="#BD2B12"
                    />
                </div>
            </div>
        </>
    );
};

export default CivilCriminalDashboard;
