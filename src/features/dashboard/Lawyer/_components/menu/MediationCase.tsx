import { Button } from "@/components/ui/button";
import { GetCaseAction } from "@/features/cases/server/caseAction";
import { useAppSelector } from "@/hooks/redux";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LawyersReportGrid from "../LawyerReportGrid";
import CaseManagementDemo from "./components/skeletonLoader";
import LawyersReportTable from "../LawyerReportTable";
import { LayoutGrid, ListCollapse } from "lucide-react";

export default function MediationCase() {
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
            // TODO Update this to the right Action
            return await GetCaseAction(filters);
        },
        staleTime: 100000,
    });
 

    return (
        <div className="space-y-4 ">
            <div className="flex justify-between">
                <div className="flex items-center text-sm space-x-2 bg-white p-2">
                    Filed Cases
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
        </div>
    );
}