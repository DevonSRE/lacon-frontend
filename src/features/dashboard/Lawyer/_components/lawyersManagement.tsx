'use client';

import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Filter, ListFilter, Search } from "lucide-react";
import { GetUserAction } from "@/features/usersRole/userRoleAction";
import { createUserColumns } from "./table-columns";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { useAction } from "@/context/ActionContext";
import { AddLawyerSheet } from "./addLawyer";
import { Icons } from "@/icons/icons";
import { useAppSelector } from "@/hooks/redux";
import { IUser } from "@/types/case";
import { ROLES } from "@/types/auth";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
type Checked = DropdownMenuCheckboxItemProps["checked"]

export default function Lawyers() {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const { setIsOpen } = useAction();

    const { data: user } = useAppSelector((state) => state.profile);

    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetType, setSheetType] = useState<"view" | "edit" | null>(null);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

    const handleOpenSheet = (user: IUser, type: "view" | "edit") => {
        setSelectedUser(user);
        setSheetType(type);
        setSheetOpen(true);
    };
    const columns = useMemo(
        () =>
            createUserColumns(user?.role as ROLES,
                (user) => handleOpenSheet(user, "view"),
                (user) => handleOpenSheet(user, "edit"),
                // createUserColumns(user?.role!, "all"),
            ),
        [user?.role]
    );


    const { data, isLoading } = useQuery({
        queryKey: ["getUsers", currentPage, searchTerm],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
                query: searchTerm,
            };
            return await GetUserAction(filters);
        },
        staleTime: 100000,
    });

    if (!isLoading) {
        const statusColors = {
            Active: "bg-green-100 text-green-600",
            Inactive: "bg-yellow-100 text-yellow-600",
        };

        // const handleRowClick = (row: any) => {
        //     redirect(`/user-profile/${encodeURIComponent(row.id)}`);
        // };

        function setCurrentPage(page: number): void {
            throw new Error("Function not implemented.");
        }
        return (
            <>
                <AddLawyerSheet />
                <div className="p-6">
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
                                    <DropdownMenuCheckboxItem>Active</DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>Inactive (Suspended)</DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </section>
                    </div>
                    <DataTable columns={columns} loading={isLoading} data={data?.data?.data} />
                    {/* <LawyersTable loading={isLoading} data={data?.data?.data} userRole={user?.role ?? ROLES.USER} /> */}
                    {/* {data?.data?.data.length > 0 && (
                        <div className="flex justify-end pt-4">
                            <TablePagination
                                currentPage={currentPage}
                                totalCount={data?.data?.total_rows ?? 0}
                                pageSize={DEFAULT_PAGE_SIZE}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    )} */}

                    {/* <div className="flex justify-between items-center mt-4">
                        <Button variant="outline" className="flex items-center gap-2">
                            <ChevronLeft className="h-4 w-4" /> Previous
                        </Button>
                        <span className="text-sm">1</span>
                        <Button variant="outline" className="flex items-center gap-2">
                            Next <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div> */}



                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                            <SheetHeader>
                                <SheetTitle>
                                    {sheetType === "view" ? "View User" : "Edit User"}
                                </SheetTitle>
                            </SheetHeader>
                            {selectedUser && (
                                <div className="mt-4 space-y-4">
                                    <p><strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}</p>
                                    <p><strong>Email:</strong> {selectedUser.email}</p>
                                    {sheetType === "edit" && (
                                        <Button>Edit Form Here</Button>
                                    )}
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>

                </div>
            </>

        );
    }
}


