import { DataTable } from "@/components/data-table";
import { Icons } from "@/icons/icons";
import { useQuery } from "@tanstack/react-query";
import TablePagination from "@/components/TablePagination";
import { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { AllUnitTable, PDSSBailTable, ProbunoLawyerColumns } from "../table_Column";
import { GetAllUnit, GetReportAdminLawyer } from "../../server/reportAction";
import { useAction } from "@/context/ActionContext";

export default function PDSSBAIL() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, error } = useQuery({
        queryKey: ["getAllUnitReport", currentPage],
        queryFn: async () => {
            const filters = {
                page: currentPage
            };
            return await GetAllUnit(filters);
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
    const pdssBail = data?.data?.pdss_bail ?? [];
    return (
        <div className="overflow-x-auto">
            <div className="">
                <div className="flex justify-between items-center py-4">
                    <h2 className="text-xl font-semibold">PDSS Bail at Police Stations</h2>
                    <Icons.trendingIcon className="w-5 h-5 text-gray-400" />
                </div>
                <DataTable
                    columns={PDSSBailTable}
                    loading={isLoading}
                    data={pdssBail || []}
                />
                {/* {data?.data?.data?.length > 0 && (
                    <div className="flex justify-end pt-4">
                        <TablePagination
                            currentPage={currentPage}
                            totalCount={data?.data.total_rows}
                            pageSize={DEFAULT_PAGE_SIZE}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                )} */}
                <div className="flex justify-end pt-4">
                    <TablePagination
                        currentPage={1}
                        totalCount={PDSSBailTable.length}
                        pageSize={DEFAULT_PAGE_SIZE}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    );
}