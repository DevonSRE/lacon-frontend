import { DataTable } from "@/components/data-table";
import TablePagination from "@/components/TablePagination";
import { uploadHistoryColumns } from "./components/UploadHistoryColumn";
import { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { GetDocumentHistory, GetUserAction } from "@/features/usersRole/userRoleAction";
import { useAppSelector } from "@/hooks/redux";

export default function UploadHistory() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data: user } = useAppSelector((state) => state.profile);
    const userId = user?.id;
    const { data, isLoading } = useQuery({
        queryKey: ["getUploadHistory", currentPage, userId],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
            };
            if (!userId) {
                return { data: { data: [], total_rows: 0 }, success: false };
            }
            return await GetDocumentHistory(filters, userId);
        },
        staleTime: 100000,
    });
    console.log(userId);
    
    console.log(data);
    return (
        <div>
            <DataTable columns={uploadHistoryColumns} loading={isLoading} data={data?.data} />
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