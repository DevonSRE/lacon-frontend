import { DataTable } from "@/components/data-table";
import TablePagination from "@/components/TablePagination";
import { uploadHistoryColumns } from "./components/UploadHistoryColumn";
import { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { GetUserAction } from "@/features/usersRole/userRoleAction";

export default function UploadHistory() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading } = useQuery({
        queryKey: ["getUploadHistory", currentPage],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
            };
            return await GetUserAction(filters);
        },
        staleTime: 100000,
    });
    return (
        <div>
            <DataTable columns={uploadHistoryColumns} loading={isLoading} data={data?.data.data} />
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

        </div>
    );
}