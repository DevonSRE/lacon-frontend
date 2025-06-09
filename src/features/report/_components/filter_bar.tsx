'use client'

import { GetState } from '@/components/get-state';
import { GetZone } from '@/components/get-zone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAction } from '@/context/ActionContext';
import { useState } from "react";

export default function FilterBar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {

    const [selectedUnit, setSelectedUnit] = useState('All Units');

    const {
        selectedZoneId, setSelectedZoneId,
        selectedDuration, setselectedDuration,
        selectedStateId, setSeletedStateId,
        selectedCentreId, setselectedCentreId
    } = useAction();

    const tabs = ["Overview", "Case Types", "Lawyers", "Demographics"];

    const clearFilters = () => {
        setSelectedZoneId('');
        setSeletedStateId('');
        setselectedDuration('');
        setselectedCentreId('All Center');
        setSelectedUnit('All Units');
    };

    return (
        <div className="text-sm gap-4 items-center">
            <div className="flex flex-wrap items-center space-x-2 bg-white p-2">
                <Select value={selectedDuration} onValueChange={setselectedDuration}>
                    <SelectTrigger className="w-[180px] h-11">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="30">Last 30 Days</SelectItem>
                        <SelectItem value="90">Last Quarter</SelectItem>
                        <SelectItem value="180">Last 6 Months</SelectItem>
                        <SelectItem value="360">Year till date</SelectItem>
                    </SelectContent>
                </Select>

                <div className="w-[180px]">
                    <GetZone
                        value={selectedZoneId}
                        onValueChange={setSelectedZoneId}
                        placeholder="Select zone"
                    />
                </div>

                <div className="w-[180px]">
                    <GetState
                        value={selectedStateId}
                        onValueChange={setSeletedStateId}
                        placeholder="Select state"
                    />
                </div>

                <Select value={selectedCentreId} onValueChange={setselectedCentreId}>
                    <SelectTrigger className="w-[180px] h-11">
                        <SelectValue placeholder="All Center" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All Center">All Center</SelectItem>
                        <SelectItem value="Center A">Center A</SelectItem>
                        <SelectItem value="Center B">Center B</SelectItem>
                        <SelectItem value="Center C">Center C</SelectItem>
                        <SelectItem value="Center D">Center D</SelectItem>
                    </SelectContent>
                </Select>

                <button
                    onClick={clearFilters}
                    className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 h-11 rounded"
                >
                    Clear Filters
                </button>
            </div>

            <div className="flex mt-4 gap-4 items-center">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 h-11 py-2 rounded ${activeTab === tab
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-800"
                            }`}
                    >
                        {tab}
                    </button>
                ))}

                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                    <SelectTrigger className="w-[180px] bg-black text-white rounded-none h-11">
                        <SelectValue placeholder="All Units" />
                    </SelectTrigger>
                    <SelectContent className="border-2 p-2 space-y-2 border-black">
                        <SelectItem value="All Units">All Units</SelectItem>
                        <SelectItem value="PDSS">PDSS</SelectItem>
                        <SelectItem value="Oscar unit">Oscar unit</SelectItem>
                        <SelectItem value="perogative of mercy">Prerogative of mercy</SelectItem>
                        <SelectItem value="Decongestion unit">Decongestion Unit</SelectItem>
                        <SelectItem value="DIO">DIO</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
