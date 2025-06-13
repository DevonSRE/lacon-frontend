'use client';

import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { createProbunoRequestColumns } from "./components/table-columns";
import { useQuery } from "@tanstack/react-query";
import TablePagination from "@/components/TablePagination";
import { redirect, useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Search } from "lucide-react";
import { AddUserSheet } from "../component/AddUserSheet";
import { useAction } from "@/context/ActionContext";
import { GetLawyerRequestAction } from "./userRoleAction";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Icons } from "@/icons/icons";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { useDebounce } from 'use-debounce';
import { ROLES } from "@/types/auth";
import { useAppSelector } from "@/hooks/redux";
import { ILawyerRequest, IUser } from "@/types/case";
import { CustomDialog } from "@/components/CustomDialog";
import ReviewProbuno from "./components/ReviewProbuno";


export default function ProbunoRequest() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const { setIsOpen } = useAction();
    const [selectedRole, setSelectedRole] = useState<ROLES | undefined>(undefined);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const { data: user } = useAppSelector((state) => state.profile);
    const [selectedUser, setSelectedUser] = useState<ILawyerRequest | null>(null);
    const [dailogOpen, setdailogOpen] = useState(false);
    const [sheetType, setSheetType] = useState<"suspend" | "delete" | null>(null);

    const handleOpenSheet = (user: ILawyerRequest, type: "review") => {
        setSelectedUser(user);
        setdailogOpen(true);
    };
    const columns = useMemo(
        () =>
            createProbunoRequestColumns(user?.role as ROLES,
                (user) => handleOpenSheet(user, "review"),
            ),
        [user?.role]
    );


    const { data, isLoading } = useQuery({
        queryKey: ["getProbunoLawyersRequest", currentPage, debouncedSearchTerm, selectedRole],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
                keyword: debouncedSearchTerm ?? "",
                user_type: selectedRole ?? "",
            };
            return await GetLawyerRequestAction(filters);
        },
        staleTime: 100000,
    });

    const actionType: string[] = [
        "create", "Suspension", "Delete"
    ];

    const handleActionType = (role: any) => {
        setSelectedRole(role);
        console.log("Filtering users by role:", role);
    };

    return (
        <div className="flex flex-1 flex-col gap-6 pt-0 mx-4 lg:mx-0">
            <div className="row flex justify-between">
                <div className="text-2xl font-semibold">Probuno Request from Website</div>
                <Button onClick={() => setIsOpen(true)} className="bg-red-600 hover:bg-red-700 text-white h-11 rounded-sm">
                    <Icons.plusIcon className="mr-2" />
                    New User
                </Button>
            </div>

            {/* <CasesDataTableToolbar /> */}
            <div className="flex items-center mt-6 gap-6 w-full justify-between">
                <div className="relative w-full">
                    <Search className="absolute left-3 w-4 top-1/2 -translate-y-1/2  text-neutral" />
                    <Input
                        type="search"
                        name="searchTerm"
                        autoComplete="off"
                        data-form-type="other"
                        placeholder="Search User By Name"
                        className="pl-9  h-11 w-full"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <section className="flex gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="text-sm h-11 w-32">
                                <Filter size={20} className="mr-2" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="h-auto space-y-2 space-x-2 overflow-y-auto">
                            {actionType.map((tab) => (
                                <DropdownMenuCheckboxItem checked={selectedRole === tab} onClick={() => handleActionType(tab)}>
                                    {tab}
                                </DropdownMenuCheckboxItem>
                            ))};
                        </DropdownMenuContent>
                    </DropdownMenu>
                </section>
            </div>
            <DataTable columns={columns} loading={isLoading} data={data?.data.data} />
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
            <AddUserSheet />
            <CustomDialog open={dailogOpen} setOpen={setdailogOpen} className="w-4xl">
                <ReviewProbuno open={dailogOpen} setOpen={setdailogOpen} />
            </CustomDialog>
        </div>
    )
}
