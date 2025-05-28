'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useState } from "react";


export default function FilterBar({ activeTab, setActiveTab }: {
    activeTab: string, setActiveTab: (tab: string) => void
}) {
    const [selectedPeriod, setSelectedPeriod] = useState('Last 6 Months')
    const [selectedZone, setSelectedZone] = useState('All Zones')
    const [selectedUnit, setSelectedUnit] = useState('unit')
    const tabs = ["Overview", "Case Types", "Lawyers", "Unit", "Demographics"];
    return (
        <div className="flex flex-wrap text-sm gap-4 items-center">
            <div className="flex items-center space-x-2 bg-white p-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                        <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                        <SelectItem value="Last Year">Last Year</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All Zones">All Zones</SelectItem>
                        <SelectItem value="North">North</SelectItem>
                        <SelectItem value="South">South</SelectItem>
                        <SelectItem value="East">East</SelectItem>
                        <SelectItem value="West">West</SelectItem>
                    </SelectContent>
                </Select>

                {selectedZone !== 'All Zones' && (
                    <Select value={selectedZone} onValueChange={setSelectedZone}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select zone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All State">All State</SelectItem>
                            <SelectItem value="North">Abia</SelectItem>
                            <SelectItem value="South">South</SelectItem>
                            <SelectItem value="East">East</SelectItem>
                            <SelectItem value="West">West</SelectItem>
                        </SelectContent>
                    </Select>
                )}

            </div>

            {/* Tabs */}
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded ${activeTab === tab
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-800"
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>

    );
}