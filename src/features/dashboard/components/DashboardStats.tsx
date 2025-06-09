import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  titleColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, titleColor = "text-gray-500" }) => {
  return (
    <div className="border rounded-xs p-6 space-y-2 shadow-sm bg-white">
      <div className={`text-sm font-medium ${titleColor}`}>{title}</div>
      <div className="text-2xl font-semibold text-black">{value}</div>
      <div className="text-sm text-gray-400">{subtitle}</div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Cases" value="0" subtitle="Across all departments" titleColor="text-red-500" />
      <StatCard title="Pending Assignments" value="0" subtitle="Awaiting department routing" />
      <StatCard title="Pro Bono Applications" value="0" subtitle="Review needed" />
      <StatCard title="New Cases This Week" value="0" subtitle="Criminal & Civil combined" />
    </div>
  );
};

export default DashboardStats;
