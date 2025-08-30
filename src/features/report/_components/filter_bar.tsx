'use client'

import { GetState } from '@/components/get-state';
import { GetZone } from '@/components/get-zone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAction } from '@/context/ActionContext';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { GetZones } from '@/server/actions/GetDetails';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState, useMemo } from "react";

export default function FilterBar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
    const tabs = ["Overview", "Case Types", "Lawyers", "Demographics"];
    const { data, isLoading: loading } = useQuery({
        queryKey: ["zones"],
        queryFn: async () => {
            const filters = {
                page: 1,
                size: DEFAULT_PAGE_SIZE,
            };
            return await GetZones(filters);
        },
        placeholderData: keepPreviousData,
        staleTime: 50000,
    });

    const {
        selectedZoneId, setSelectedZoneId,
        selectedDuration, setselectedDuration,
        selectedStateId, setSeletedStateId,
        selectedCentreId, setselectedCentreId,
        selectedUnit, setSelectedUnit,
        setSelectedZone,
        setSelectesState
    } = useAction();

    // Get the selected zone's states
    const selectedZoneStates = useMemo(() => {
        if (!selectedZoneId || !data?.data?.data) return [];

        const selectedZone = data.data.data.find((zone: any) => zone.id === selectedZoneId);
        return selectedZone?.states || [];
    }, [selectedZoneId, data]);

    const clearFilters = () => {
        setSelectedZoneId('');
        setSeletedStateId('');
        setselectedDuration('');
        setselectedCentreId('All Center');
        setSelectedUnit('');
        setSelectedZone('');
        setSelectesState('');
    };

    const handleDivisionChange = (newValue: string) => {
        console.log("Selected Zone ID:", newValue);
        if (newValue === "all") {
            setSelectedZoneId?.("all");
            setSeletedStateId?.('');
            return;
        }
        setSelectedZoneId?.(newValue);
        setSeletedStateId?.('');

        // ✅ Find and store the selected zone title
        const selectedZone = data?.data?.data?.find((zone: any) => zone.id === newValue);
        if (selectedZone) {
            console.log("Selected Zone Title:", selectedZone.title);
            setSelectedZone?.(selectedZone.title); // <- use a state setter for the title
        }
    };

    const handleStateChange = (stateId: string) => {
        setSeletedStateId?.(stateId);

        const selectedState = selectedZoneStates?.find((zone: any) => zone.id === stateId);
        if (selectedState) {
            console.log("Selected Zone Title:", selectedState.title);
            setSelectesState?.(selectedState.title); // <- use a state setter for the title
        }
    };

    return (
        <div className="text-sm gap-4 items-center">
            <div className="flex flex-wrap items-center space-x-2 bg-white">
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


                {/* Zone Selection */}
                <div className="w-[180px]">
                    <Select
                        onValueChange={handleDivisionChange}
                        value={selectedZoneId ?? ""}
                        name="zone_id">
                        <SelectTrigger
                            className="h-11 flex justify-between items-center"
                            disabled={loading}
                            loading={loading}
                            variant={"underlined"}
                        >
                            <SelectValue
                                className="text-neutral-700 text-xs mx-4"
                                placeholder={loading ? "Loading zone..." : "Select Zone"}
                            />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-zinc-900">
                            <SelectItem value="all" className="py-2">
                                All Zones
                            </SelectItem>
                            {data?.data?.data?.length > 0 ? (
                                data?.data?.data.map((location: any) => (
                                    <SelectItem key={location.id} value={location.id} className="py-2">
                                        {location.title}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="py-2 px-4 text-sm text-gray-500">No Zone available</div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* State Selection - Only show when a zone is selected */}
                {selectedZoneId && selectedZoneId !== "all" && (
                    <div className="w-[180px]">
                        <Select
                            value={selectedStateId || ""}
                            onValueChange={handleStateChange}
                            name="state_id"
                        >
                            <SelectTrigger className="h-11 flex justify-between items-center" variant={"underlined"}>
                                <SelectValue
                                    className="text-neutral-700 text-xs mx-4"
                                    placeholder="Select State"
                                />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-zinc-900">
                                <SelectItem value="all" className="py-2">
                                    All States
                                </SelectItem>
                                {selectedZoneStates.length > 0 ? (
                                    selectedZoneStates.map((state: any) => (
                                        <SelectItem key={state.id} value={state.id} className="py-2">
                                            {state.title}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="py-2 px-4 text-sm text-gray-500">No states available</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Clear filters button */}
                {(selectedZoneId || selectedStateId || selectedDuration) && (
                    <button
                        onClick={clearFilters}
                        className="ml-auto bg-red-500 hover:bg-red-500 text-white px-4 h-9 rounded">
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="flex mt-4 gap-4 items-center">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setSelectedUnit('') }}
                        className={`px-4 h-11 py-2 rounded text-xs
                                ${(activeTab === tab)
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        disabled={activeTab === tab}
                    >
                        {tab}
                    </button>
                ))}

                <Select value={selectedUnit} onValueChange={(value) => { setActiveTab(value); setSelectedUnit(value) }}>
                    <SelectTrigger className={`w-auto min-w-24 text-xs rounded-none h-11 ${selectedUnit === "" ? "bg-gray-100 text-black" : "bg-black text-white"}`}>
                        <SelectValue placeholder="Units" />
                    </SelectTrigger>
                    <SelectContent className="border-2 p-2 space-y-2 border-black text-xs">
                        <SelectItem value="All Units">All Units</SelectItem>
                        <SelectItem value="PDSS">PDSS</SelectItem>
                        <SelectItem value="Oscar unit">Oscar unit</SelectItem>
                        <SelectItem value="perogative of mercy">Prerogative of mercy</SelectItem>
                        <SelectItem value="Decongestion unit">Decongestion Unit</SelectItem>
                        <SelectItem value="DIO">DIO</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div >
    );
}