'use client';

import { DataTable } from "@/components/data-table";
// import { GetProcuemntListAction } from "@/lib/action/procurement";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import TablePagination from "@/components/TablePagination";
import { redirect } from "next/navigation";
import { mainColumns } from "./table-columns";


export default function CaseAssignmentPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    //   const { data, isLoading } = useQuery({
    //     queryKey: ["getProcuemnt", currentPage, searchTerm],
    //     queryFn: async () => {
    //       const filters = {
    //         page: currentPage,
    //         size: DEFAULT_PAGE_SIZE,
    //         query: searchTerm,
    //       };
    //       return await GetProcuemntListAction(filters);
    //     },
    //     staleTime: 100000,
    //   });

    //   if (!isLoading) {
    //     console.log(data?.data);
    //     console.log(data?.data?.length);
    //   }

    const handleRowClick = (row: any) => {
        redirect(`/procurement-details/${encodeURIComponent(row.id)}`);
    };

    return (
        <div className="flex flex-1 flex-col gap-4  pt-0">
            <div className=" flex-1 bg-white md:min-h-min" >
                <div className="flex flex-1 flex-col gap-4  pt-0">
                    <DataTable onRowClick={handleRowClick} columns={mainColumns} loading={loading} data={[]} />
                    {/* {data?.data?.data.length > 0 && (
                        <div className="flex justify-end pt-4">
                        <TablePagination
                            currentPage={currentPage}
                            totalCount={data?.data.total_rows}
                            pageSize={DEFAULT_PAGE_SIZE}
                            onPageChange={(page) => setCurrentPage(page)} />
                        </div>)} */}
                </div>
            </div>
        </div>
    )
}
