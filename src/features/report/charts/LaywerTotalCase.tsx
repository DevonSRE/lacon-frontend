// pages/index.tsx
import React from 'react';
import BarChart from './BarChart';

const sampleData = [
    { month: 'January', percentage: 45 },
    { month: 'February', percentage: 87 },
    { month: 'March', percentage: 15 },
    { month: 'April', percentage: 70 },
    { month: 'May', percentage: 65 },
    { month: 'June', percentage: 43 },
    { month: 'July', percentage: 86 },
    { month: 'August', percentage: 70 },
    { month: 'September', percentage: 86 },
    { month: 'October', percentage: 65 },
    { month: 'November', percentage: 60 },
];

export default function LawyerTotalCase() {
    return (
        <div className="mt-6">
            <h1 className="text-xl font-semibold mb-4">Lawyer Total Cases Completion Metric</h1>
            <BarChart data={sampleData} />
        </div>
    );
}
