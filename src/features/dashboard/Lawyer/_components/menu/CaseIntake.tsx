'use client';
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { caseIntakColumns } from "./components/CaseIntakeColumn";
import TablePagination from "@/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { GetCaseInTake } from "../../server/caseIntak";

export default function CaseIntake() {
    const tabs = ["All Cases", "Pending Review", "Rejected"];
    const [activeTab, setActiveTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientNameSearch, setClientNameSearch] = useState("");
    const [caseIdSearch, setCaseIdSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [debouncedSearchTerm] = useDebounce(clientNameSearch, 500);
    const [debouncedCaseIdSearch] = useDebounce(caseIdSearch, 500);

    // Determine the status based on active tab and status filter
    const getStatusFromTab = (tabIndex: number) => {
        switch (tabIndex) {
            case 0: return undefined; // All Cases
            case 1: return "Pending Review";
            case 2: return "Rejected";
            default: return undefined;
        }
    };

    const finalStatus = statusFilter || getStatusFromTab(activeTab);

    const { data, isLoading } = useQuery({
        queryKey: ["getCaseIntake", currentPage, debouncedSearchTerm, debouncedCaseIdSearch, activeTab, statusFilter, finalStatus],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
                query: debouncedSearchTerm,
                caseId: debouncedCaseIdSearch,
                status: finalStatus
            };
            return await GetCaseInTake(filters);
        },
        staleTime: 100000,
    });

    // Reset to first page when filters change
    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleTabChange = (tabIndex: number) => {
        setActiveTab(tabIndex);
        setCurrentPage(1);
        // Clear status filter when changing tabs
        setStatusFilter(undefined);
    };

    return (
        <>
            <div className="flex justify-between">
                <div className="flex items-center text-sm space-x-2 bg-white p-2">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(idx)}
                            className={`px-4 py-2 rounded ${activeTab === idx
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-800"
                                }`}>
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end mb-4 space-x-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search Intake"
                            className="pl-10 h-11"
                            value={clientNameSearch}
                            onChange={(e) => {
                                setClientNameSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search by CaseId"
                            className="pl-10 h-11"
                            value={caseIdSearch}
                            onChange={(e) => {
                                setCaseIdSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="">
                        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="h-11 text-xs">
                                <SelectValue placeholder="Case Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Unassigned">Unassigned</SelectItem>
                                <SelectItem value="Assigned">Assigned</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <DataTable columns={caseIntakColumns} loading={isLoading} data={data?.data.data} />
            {data?.data?.data.length > 0 && (
                <div className="flex justify-end pt-4">
                    <TablePagination
                        currentPage={currentPage}
                        totalCount={data?.data.total_rows}
                        pageSize={DEFAULT_PAGE_SIZE}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}
        </>
    );
}