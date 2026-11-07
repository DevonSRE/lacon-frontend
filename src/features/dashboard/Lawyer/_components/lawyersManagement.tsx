'use client';

import React, { useCallback, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { ListFilter, Search } from "lucide-react";
import { GetLawyersManagementAction } from "@/features/usersRole/userRoleAction";
import { createLawyersManagementColumns } from "./table-columns";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { CustomDialog } from "@/components/CustomDialog";
import SuspensionForm from "./sheet/SuspendDelete";

import { getPendingAccountRequests } from "@/features/usersRole/invitation-actions";
import { GetState } from "@/components/get-state";
import { roleLabel } from "@/lib/role-labels";
import { LAWYER_TYPES } from "@/lib/lawyer-types";

export default function Lawyers() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState("");
    // Who the list is narrowed to (T9). Statistics answers questions by state
    // and by kind of lawyer, and the three filters combine.
    const [stateId, setStateId] = useState("");
    const [lawyerType, setLawyerType] = useState("");
    const { setIsOpen } = useAction();
    const { data: user } = useAppSelector((state) => state.profile);

    // Decoupled state
    const [sheetOpen, setSheetOpenMain] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [sheetUser, setSheetUser] = useState<ILawyerManagement | null>(null);

    const [sheetType, setSheetType] = useState<"view" | "edit" | "suspend" | "delete" | null>(null);

    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const handleOpenSheet = useCallback((user: ILawyerManagement, type: "view" | "edit" | "suspend" | "delete") => {
        setSheetUser(user);
        setSheetType(type);

        // Reset both states first to avoid conflicts
        setSheetOpenMain(false);
        setDialogOpen(false);

        // Then set the appropriate one
        if (type === "view" || type === "edit") {
            setSheetOpenMain(true);
        } else if (type === "suspend" || type === "delete") {
            setDialogOpen(true);
        }
    }, []); // Empty dependency array since it doesn't depend on any external values

    const pendingRequests=useQuery({queryKey:["pending-account-requests",user?.id],queryFn:getPendingAccountRequests,enabled:!!user?.id});
    const columns = useMemo(
        () =>
            createLawyersManagementColumns(
                user?.role as ROLES,
                (user) => handleOpenSheet(user, "view"),
                (user) => handleOpenSheet(user, "edit"),
                (user) => handleOpenSheet(user, "suspend"),
                (user) => handleOpenSheet(user, "delete"),
            ),
        [user?.role, handleOpenSheet] // Include handleOpenSheet in dependencies
    );

    const { data, isLoading } = useQuery({
        queryKey: ["getLaweyersManagement", currentPage, debouncedSearchTerm, status, stateId, lawyerType],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
                keyword: debouncedSearchTerm,
                status: status,
                ...(stateId ? { state: stateId } : {}),
                ...(lawyerType ? { user_type: lawyerType } : {}),
            };
            return await GetLawyersManagementAction(filters);
        },
        staleTime: 100000,
    });

    // const handleRowClick = (row: ILawyerManagement) => {
    //     handleOpenSheet(row, "view");
    // };

    return (
        <>
            <AddLawyerSheet />
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold">Lawyer Management</h1>
                    {/* Statistics reads the list and adds nobody (T1). */}
                    {user?.role !== ROLES.STATISTICS && (
                        <Button onClick={() => setIsOpen(true)} className="bg-red-600 text-white h-11">
                            <Icons.plusIcon />
                            Add New Lawyer
                        </Button>
                    )}
                </div>

                <div className="flex items-center mt-6 gap-6 w-full justify-between">
                    <div className="relative w-full">
                        <Search className="absolute left-3 w-4 top-1/2 -translate-y-1/2 text-neutral" />
                        <Input
                            type="search"
                            autoComplete="off"
                            placeholder="Search User By Name"
                            className="pl-9 h-11 w-full"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <section className="flex flex-wrap items-center gap-3">
                        <div className="w-56">
                            {/* The state a lawyer practises in, which pro bono
                                lawyers carry from the state they registered in (T9). */}
                            <GetState
                                value={stateId}
                                placeholder="Any state"
                                onValueChange={(value) => { setStateId(value); setCurrentPage(1); }}
                            />
                        </div>
                        <select
                            aria-label="Lawyer type"
                            className="h-11 rounded border px-3 text-sm"
                            value={lawyerType}
                            onChange={(event) => { setLawyerType(event.target.value); setCurrentPage(1); }}
                        >
                            <option value="">Any type</option>
                            {LAWYER_TYPES.map((type) => (
                                <option key={type} value={type}>{roleLabel(type)}</option>
                            ))}
                        </select>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-sm h-11 w-24">
                                    <ListFilter size={20} className="mr-2" />
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="space-y-2 space-x-2 overflow-y-auto">
                                <DropdownMenuCheckboxItem onClick={() => { setStatus(""); setCurrentPage(1); }}>
                                    Any status
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem onClick={() => { setStatus("active"); setCurrentPage(1); }}>
                                    Active
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem onClick={() => { setStatus("inactive"); setCurrentPage(1); }}>
                                    Inactive (Suspended)
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {(stateId || lawyerType || status) && (
                            <Button
                                variant="ghost"
                                className="h-11"
                                onClick={() => { setStateId(""); setLawyerType(""); setStatus(""); setCurrentPage(1); }}
                            >
                                Clear filters
                            </Button>
                        )}
                    </section>
                </div>

                <DataTable
                    // onRowClick={handleRowClick}
                    columns={columns}
                    loading={isLoading}
                    data={data?.data?.data}
                />

                <section className="space-y-2"><h2 className="font-semibold">Pending creation</h2>
                {pendingRequests.data?.success ? (pendingRequests.data.data.length ? <ul>{pendingRequests.data.data.map(r=><li key={r.ID} className="rounded border p-3">{r.LawyerName} · {r.LawyerEmail} · Pending creation — awaiting the Director General</li>)}</ul> : <p className="text-sm text-gray-500">No account creation is waiting for approval.</p>) : pendingRequests.data ? <p role="alert">{pendingRequests.data.message}</p> : <p>Loading requests…</p>}
                </section>
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

                {sheetOpen && (sheetType === "view" || sheetType === "edit") && (
                    <CustomeSheet open={sheetOpen} setOpen={setSheetOpenMain}>
                        <ViewEditLawyer lawyer={sheetUser} sheetType={sheetType} setOpen={setSheetOpenMain} />
                    </CustomeSheet>
                )}

                {dialogOpen && (sheetType === "suspend" || sheetType === "delete") && (
                    <CustomDialog open={dialogOpen} setOpen={setDialogOpen} className="w-xl">
                        <SuspensionForm lawyer={sheetUser} sheetType={sheetType} setOpen={setDialogOpen} />
                    </CustomDialog>
                )}
            </div>
        </>
    );
}