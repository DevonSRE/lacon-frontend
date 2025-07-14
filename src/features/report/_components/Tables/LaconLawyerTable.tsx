import { DataTable } from "@/components/data-table";
import { Icons } from "@/icons/icons";
import { laconLawyerColumns, stateColumns } from "../table_Column";
import { GetLACONLAWYER } from "../../server/reportAction";
import { useQuery } from "@tanstack/react-query";
import TablePagination from "@/components/TablePagination";
import { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
export default function LaconLawyerTable() {
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, error } = useQuery({
        queryKey: ["getLACONLawyersOverview", currentPage],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
            };
            return await GetLACONLAWYER(filters);
        },
        staleTime: 100000,
    });

    // Handle error state
    if (!isLoading && error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-600">Error loading data</div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="">
                <div className="flex justify-between items-center py-4">
                    <h2 className="text-xl font-semibold">LACON Lawyers Performance</h2>
                    <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                </div>
                <DataTable
                    columns={laconLawyerColumns}
                    loading={isLoading}
                    data={data?.data?.data || []}
                />
                {data?.data?.data?.length > 0 && (
                    <div className="flex justify-end pt-4">
                        <TablePagination
                            currentPage={currentPage}
                            totalCount={data?.data.total_rows}
                            pageSize={DEFAULT_PAGE_SIZE}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                )}

                {/* <div className="flex justify-end pt-4">
                    <TablePagination
                        currentPage={1}
                        totalCount={data?.data?.lacon_lawyer_performance.length}
                        pageSize={DEFAULT_PAGE_SIZE}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div> */}
            </div>
        </div>
    );
}