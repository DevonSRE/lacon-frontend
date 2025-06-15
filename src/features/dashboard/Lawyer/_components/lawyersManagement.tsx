'use client';

import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Filter, ListFilter, Search } from "lucide-react";
import { GetLawyersManagementAction, } from "@/features/usersRole/userRoleAction";
import { createLawyersColumns, createLawyersManagementColumns } from "./table-columns";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { useAction } from "@/context/ActionContext";
import { AddLawyerSheet } from "./addLawyer";
import { Icons } from "@/icons/icons";
import { useAppSelector } from "@/hooks/redux";
import { ILawyerManagement } from "@/types/case";
import { ROLES } from "@/types/auth";
import { CustomeSheet } from "@/components/CustomSheet";
import ViewEditLawyer from "./sheet/ViewEditLawyer";
import { useDebounce } from 'use-debounce';
import TablePagination from "@/components/TablePagination";


export default function Lawyers() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState("");
    const { setIsOpen } = useAction();
    const { data: user } = useAppSelector((state) => state.profile);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetType, setSheetType] = useState<"view" | "edit" | "suspend" | "delete" | null>(null);
    const [selectedUser, setSelectedUser] = useState<ILawyerManagement | null>(null);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const handleOpenSheet = (user: ILawyerManagement, type: "view" | "edit" | "suspend" | "delete") => {
        setSelectedUser(user);
        setSheetType(type);
        setSheetOpen(true);
    };

    const columns = useMemo(
        () =>
            createLawyersManagementColumns(user?.role as ROLES,
                (user) => handleOpenSheet(user, "view"),
                (user) => handleOpenSheet(user, "edit"),
                (user) => handleOpenSheet(user, "suspend"),
                (user) => handleOpenSheet(user, "delete"),
            ),
        [user?.role]
    );


    const { data, isLoading } = useQuery({
        queryKey: ["getLaweyersManagement", currentPage, debouncedSearchTerm, status],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
                keyword: debouncedSearchTerm,
                status: status,
            };
            return await GetLawyersManagementAction(filters);
        },
        staleTime: 100000,
    });

    const statusColors = {
        Active: "bg-green-100 text-green-600",
        Inactive: "bg-yellow-100 text-yellow-600",
    };

    const handleRowClick = (row: any) => {
        // redirect(`/user-profile/${encodeURIComponent(row.id)}`);
    };

    return (
        <>
            <AddLawyerSheet />
            <div className="">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold">Lawyer Management</h1>
                    <Button onClick={() => setIsOpen(true)} className="bg-red-600 text-white h-11">
                        <Icons.plusIcon />
                        Add New Lawyer
                    </Button>
                </div>
                <div className="flex items-center mt-6 gap-6 w-full justify-between">
                    <div className="relative w-full">
                        <Search className="absolute left-3 w-4 top-1/2 -translate-y-1/2  text-neutral" />
                        <Input
                            type="search"
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
                                <Button variant="outline" className="text-sm h-11 w-24">
                                    <ListFilter size={20} className="mr-2" />
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="h-auto space-y-2 space-x-2 overflow-y-auto">
                                <DropdownMenuCheckboxItem
                                    onClick={() => setStatus("active")}
                                >
                                    Active
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    onClick={() => setStatus("inactive")}
                                >
                                    Inactive (Suspended)
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </section>
                </div>
                <DataTable onRowClick={handleRowClick} columns={columns} loading={isLoading} data={data?.data?.data} />
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

                <CustomeSheet open={sheetOpen} setOpen={setSheetOpen}>
                    <ViewEditLawyer lawyer={selectedUser} sheetType={sheetType} setOpen={setSheetOpen} />
                </CustomeSheet>

            </div>
        </>

    );
}


