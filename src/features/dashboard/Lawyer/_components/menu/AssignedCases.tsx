// components/AssignedCases.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid3X3, LayoutGrid, List, ListCollapse } from "lucide-react";
import LawyersReportGrid from "../LawyerReportGrid";
import LawyersReportTable from "../LawyerReportTable";
import { useAppSelector } from "@/hooks/redux";
import { ICase } from "@/features/cases/_components/table-columns";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { GetCaseAction, GetEventsAction } from "@/features/cases/server/caseAction";
import CaseManagementDemo from "./components/skeletonLoader";


export default function AssignedCases() {
    const [statusFilter, setStatusFilter] = useState('');
    const [type, setType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewCase, setViewCase] = useState(false);
    const { data: user } = useAppSelector((state) => state.profile);
    const UserID = user?.id;
    const [activeTab, setActiveTab] = useState(0);
    const [view, setView] = useState("grid");

    const toggleView = () => {
        setView(view === "list" ? "grid" : "list");
    };

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["getCases", currentPage, statusFilter],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
                status: (statusFilter === "ALL CASES") ? "" : statusFilter,
            };
            return await GetCaseAction(filters);
        },
        staleTime: 100000,
    });
    const { data: eventData, isLoading: eventLoading } = useQuery({
        queryKey: ["getEvents", currentPage, statusFilter],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
            };
            console.log(UserID);

            return await GetEventsAction(filters, UserID as string);
        },
        staleTime: 100000,
    });


    const tabs = ["All Cases", "Active", "In Progress", "Closed"];
    return (
        <div className="space-y-4 ">
            <div className="flex justify-between">
                <div className="flex items-center text-sm space-x-2 bg-white p-2">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(idx);
                                setStatusFilter(tab.toUpperCase());
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 rounded ${activeTab === idx
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-800"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end items-center mb-4 space-x-2">
                    <Button variant={"outline"} size="icon" onClick={toggleView}>
                        {view === "list" ? <LayoutGrid /> : <ListCollapse />}
                    </Button>
                    <div className="text-center">
                        {view === "list" ? "List View" : "Grid View"}
                    </div>
                </div>
            </div>
            {isLoading ? (
                <CaseManagementDemo />
            ) : data?.data?.data?.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No cases found.
                </div>
            ) : view === "grid" ? (
                <LawyersReportGrid caseData={data?.data?.data} />
            ) : (
                <LawyersReportTable tableData={data?.data?.data} />
            )}

            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
                {eventLoading ? (
                    <div className="text-center py-10 text-gray-500">
                        Loading events...
                    </div>
                ) : eventData?.data?.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No upcoming events found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {eventData?.data?.map((event: any, idx: number) => (
                            <div key={idx} className="flex items-center space-x-2 border p-3 rounded-lg shadow-sm">
                                <input type="checkbox" />
                                <p className="text-sm">
                                    {event.event_date} <span className="mx-1">•</span> {event.event_type}
                                    <span className="mx-1">•</span> {event.case_title}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};