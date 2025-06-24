// components/LawyerSkeleton.tsx
import React from 'react';

const SkeletonBox = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
);

const LawyerSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Total Cases Completed per Month */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <SkeletonBox className="h-6 w-64" />
                    <SkeletonBox className="h-4 w-8" />
                </div>
                <div className="h-80 bg-gray-100 rounded animate-pulse" />
            </div>

            {/* LACOM Lawyers Performance */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <SkeletonBox className="h-6 w-48" />
                    <SkeletonBox className="h-4 w-8" />
                </div>
                <div className="overflow-x-auto">
                    <div className="min-w-full border rounded">
                        <div className="grid grid-cols-5 bg-gray-200 p-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <SkeletonBox key={i} className="h-4 w-full" />
                            ))}
                        </div>
                        {/* Table rows */}
                        {Array.from({ length: 6 }).map((_, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-5 gap-2 p-3 border-b">
                                {Array.from({ length: 5 }).map((__, colIndex) => (
                                    <SkeletonBox key={colIndex} className="h-4 w-full" />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LawyerSkeleton;