import React, { useState } from 'react';
import { FileText, Folder, Search } from 'lucide-react';

// Skeleton Loader Component
const CaseSkeleton = ({ status = "active" }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse relative">
            {/* Three dots menu skeleton */}
            <div className="absolute top-4 right-4">
                <div className="h-1 w-1 bg-gray-200 rounded-full"></div>
            </div>

            {/* Status Badge Skeleton */}
            <div className="mb-4">
                {status === "active" && (
                    <div className="h-6 bg-orange-100 rounded w-16"></div>
                )}
                {status === "progress" && (
                    <div className="h-6 bg-green-100 rounded w-24"></div>
                )}
                {status === "closed" && (
                    <div className="h-6 bg-red-100 rounded w-16"></div>
                )}
            </div>

            {/* Case Number Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>

            {/* Case Title Skeleton - Two lines */}
            <div className="mb-4">
                <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Tags and Date Section */}
            <div className="flex items-center gap-4 mb-6">
                <div className="h-7 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-36"></div>
            </div>

            {/* Button Skeleton - Black background like in design */}
            <div className="h-11 bg-gray-800 rounded w-full"></div>
        </div>
    );
};

// Skeleton Grid Component
const CaseSkeletonGrid = ({ count = 6 }) => {
    const statuses = ["active", "progress", "closed"];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <CaseSkeleton
                    key={index}
                    status={statuses[index % statuses.length]}
                />
            ))}
        </div>
    );
};


// Demo Component showing different states
const CaseManagementDemo = () => {
    const [currentView, setCurrentView] = useState('skeleton');


    return (
        <div className="min-h-screen  ">
            <div className=" mx-auto">
                <CaseSkeletonGrid count={6} />
            </div>
        </div>
    );
};

export default CaseManagementDemo;