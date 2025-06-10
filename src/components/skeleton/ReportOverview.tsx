// components/ReportOverview.tsx
import React from 'react';

const SkeletonBox = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
);

const ReportOverview: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 shadow rounded border space-y-2">
                        <SkeletonBox className="h-4 w-24" />
                        <SkeletonBox className="h-6 w-16" />
                        <SkeletonBox className="h-8 w-24" />
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="w-full h-64 bg-gray-100 rounded animate-pulse" />

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full border rounded">
                    <div className="grid grid-cols-7 bg-gray-200 p-2">
                        {['State', 'Received', 'Accepted', 'Completed', 'Criminal', 'Civil', 'Active Paralegals'].map((title, i) => (
                            <SkeletonBox key={i} className="h-4 w-full" />
                        ))}
                    </div>
                    {/* Table rows */}
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-7 gap-2 p-2 border-b">
                            {Array.from({ length: 7 }).map((__, colIndex) => (
                                <SkeletonBox key={colIndex} className="h-4 w-full" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportOverview;
