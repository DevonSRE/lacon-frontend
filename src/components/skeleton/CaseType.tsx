// components/CaseTypeSkeleton.tsx
import React from 'react';

const SkeletonBox = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
);

const CaseTypeSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Cases Across Departments */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <SkeletonBox className="h-6 w-48" />
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-gray-600 rounded mr-2"></div>
                            <SkeletonBox className="h-4 w-32" />
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                            <SkeletonBox className="h-4 w-24" />
                        </div>
                    </div>
                </div>
                <div className="h-80 bg-gray-100 rounded animate-pulse" />
            </div>

            {/* Case Resolution Volume */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <SkeletonBox className="h-6 w-40" />
                    <div className="flex space-x-4">
                        <div className="bg-green-100 px-3 py-1 rounded-full">
                            <SkeletonBox className="h-4 w-4" />
                        </div>
                        <div className="bg-green-100 px-3 py-1 rounded-full">
                            <SkeletonBox className="h-4 w-4" />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <div className="min-w-full border rounded">
                        <div className="grid grid-cols-4 bg-gray-200 p-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <SkeletonBox key={i} className="h-4 w-full" />
                            ))}
                        </div>
                        {/* Table rows */}
                        {Array.from({ length: 6 }).map((_, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-4 gap-2 p-3 border-b">
                                {Array.from({ length: 4 }).map((__, colIndex) => (
                                    <SkeletonBox key={colIndex} className="h-4 w-full" />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Civil vs Criminal Cases By Zone */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <SkeletonBox className="h-6 w-56" />
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-gray-600 rounded mr-2"></div>
                            <SkeletonBox className="h-4 w-28" />
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
                            <SkeletonBox className="h-4 w-20" />
                        </div>
                    </div>
                </div>
                <div className="h-80 bg-gray-100 rounded animate-pulse" />
            </div>
        </div>
    );
};

export default CaseTypeSkeleton;