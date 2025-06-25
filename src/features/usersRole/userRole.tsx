'use client';

import React, { startTransition, useActionState, useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { createUserColumns } from "./components/table-columns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TablePagination from "@/components/TablePagination";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, ListFilter, Plus, Search, ThumbsDown, ThumbsUp } from "lucide-react";
import { AddUserSheet } from "../component/AddUserSheet";
import { useAction } from "@/context/ActionContext";
import { GetUserAction } from "./userRoleAction";
import { CLIENT_ERROR_STATUS, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Icons } from "@/icons/icons";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { useDebounce } from 'use-debounce';
import { ROLES } from "@/types/auth";
import { useAppSelector } from "@/hooks/redux";
import { IUser } from "@/types/case";
import { CustomDialog } from "@/components/CustomDialog";
import { DeleteUser } from "../dashboard/server/action";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";
import { toast } from "sonner";
import { stat } from "fs";


export default function UserRoles() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const { setIsOpen } = useAction();
    const [selectedRole, setSelectedRole] = useState<ROLES | undefined>(undefined);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const { data: user } = useAppSelector((state) => state.profile);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [dailogOpen, setdailogOpen] = useState(false);
    const [state, dispatch, isPending] = useActionState(DeleteUser, undefined);
    const queryClient = useQueryClient();

    useEffectAfterMount(() => {
        if (state && CLIENT_ERROR_STATUS.includes(state?.status)) {
            toast.error(state?.message, {
                description: typeof state?.errors === "string"
                    ? state.errors
                    : state?.errors
                        ? Object.values(state.errors).flat().join(", ")
                        : undefined,
            });
        } else if (state?.status === 200 || state?.status === 201) {
            queryClient.invalidateQueries({ queryKey: ["getUsers"] });
            if (state.type === "suspend") toast.success("User Suspended successfully!");
            if (state.type === "delete") toast.success("User Deleted successfully!");
            setTimeout(() => {
                setdailogOpen(false);
                setSheetOpen(false);
            }, 2000);
        }
    }, [state]);

    const handleOpenSheet = (user: IUser, type: "suspend" | "delete") => {
        setSelectedUser(user);
        if (type === "suspend") setSheetOpen(true);
        if (type === "delete") setdailogOpen(true);
    };
    const columns = useMemo(
        () =>
            createUserColumns(user?.role as ROLES,
                (user) => handleOpenSheet(user, "suspend"),
                (user) => handleOpenSheet(user, "delete"),
            ),
        [user?.role]
    );
    const { data, isLoading } = useQuery({
        queryKey: ["getUsers", currentPage, debouncedSearchTerm, selectedRole],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
                keyword: debouncedSearchTerm ?? "",
                user_type: selectedRole ? selectedRole : "",
            };
            return await GetUserAction(filters);
        },
        staleTime: 100000,
    });
    const tabs = Object.entries(ROLES).map(([id, label]) => ({ id, label }));
    const handleRoleFilter = (role: ROLES | "All") => {
        setSelectedRole(role === "All" ? undefined : role);
        const searchInput = document.getElementsByName("searchTerm")[0] as HTMLInputElement;
        if (searchInput) searchInput.value = "";
        console.log("Filtering users by role:", role);
    };

    const dispatchAction = (type: "suspend" | "delete") => {
        startTransition(() => {
            const formData = new FormData();
            formData.append("id", String(selectedUser?.id));
            formData.append("type", String(type));
            dispatch(formData);
        });

    };

    return (
        <div className="flex flex-1 flex-col gap-6 pt-0 mx-4 lg:mx-0">
            <div className="row flex justify-between">
                <div className="text-2xl font-semibold">Users</div>
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
                            <Button variant="outline" className="text-sm h-11 w-auto">
                                <ListFilter size={20} className="mr-1" />
                                {selectedRole ?? "All"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" className="h-auto space-y-1 space-x-1 overflow-y-auto mr-10">
                            <DropdownMenuCheckboxItem
                                checked={!selectedRole}
                                onCheckedChange={() => handleRoleFilter("All")}>
                                All
                            </DropdownMenuCheckboxItem>
                            {tabs.map((tab) => (
                                <DropdownMenuCheckboxItem
                                    key={tab.id}
                                    checked={selectedRole === tab.label}
                                    onCheckedChange={() => handleRoleFilter(tab.label)}
                                >
                                    {tab.label}
                                </DropdownMenuCheckboxItem>
                            ))}
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


            <CustomDialog open={dailogOpen} setOpen={setdailogOpen} className="w-xl h-[400px]">
                <div className="mt-4 space-y-8 ">
                    <div className="flex justify-between bg-[#BD2B12] text-white rounded-xl text-center mb-10 shadow ">
                        <Icons.smallLeftFlowwer />
                        <div className="justify-center items-center text-center flex flex-col space-y-2">
                            <Button className="bg-white rounded-full"
                                onClick={() => setdailogOpen(false)}>
                                <ArrowLeft className="h-5 text-red-500 w-5" />
                            </Button>
                        </div>
                        <Icons.smallRightFlowwer />
                    </div>
                    <div className="space-y-4">
                        <div className="flex text-xl font-semibold justify-center text-center">Delete User</div>
                        <div className="justify-center text-center">Are You Sure You Want To Delete This User</div>
                        <Button onClick={() => dispatchAction("delete")} className="w-full h-11 bg-black text-white hover:bg-gray-900 group relative overflow-hidden">
                            {isPending ? "Deleting..." :
                                <>
                                    <span className="transition-opacity duration-300 group-hover:opacity-0">
                                        Yes, Delete
                                    </span>
                                    <ThumbsUp className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-5 h-5" />
                                </>
                            }
                        </Button>
                        <Button variant="outline" className="w-full h-11 group relative overflow-hidden" onClick={() => setdailogOpen(false)}>
                            <span className="transition-opacity duration-300 group-hover:opacity-0">
                                No, I'll Do it Later
                            </span>
                            <ThumbsDown className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-5 h-5 text-gray-500" />
                        </Button>
                    </div>
                </div>
            </CustomDialog>

            <CustomDialog open={sheetOpen} setOpen={setSheetOpen} className="w-xl h-[400px]">
                <div className="mt-4 space-y-8 ">
                    <div className="flex justify-between bg-[#BD2B12] text-white rounded-xl text-center mb-10 shadow ">
                        <Icons.smallLeftFlowwer />
                        <div className="justify-center items-center text-center flex flex-col space-y-2">
                            <Button className="bg-white rounded-full"
                                onClick={() => setdailogOpen(false)}>
                                <ArrowLeft className="h-5 text-red-500 w-5" />
                            </Button>
                        </div>
                        <Icons.smallRightFlowwer />
                    </div>
                    <div className="space-y-4">
                        <div className="flex text-xl font-semibold justify-center text-center">Suspend User</div>
                        <div className="justify-center text-center">Are You Sure You Want To Suspend This User</div>
                        <Button onClick={() => dispatchAction("suspend")} className="w-full h-11 bg-black text-white hover:bg-gray-900 group relative overflow-hidden">
                            {isPending ? "Suspending..." :
                                <>
                                    <span className="transition-opacity duration-300 group-hover:opacity-0">
                                        Yes, Suspend
                                    </span>
                                    <ThumbsUp className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-5 h-5" />
                                </>
                            }
                        </Button>
                        <Button variant="outline" className="w-full h-11 group relative overflow-hidden" onClick={() => setdailogOpen(false)}>
                            <span className="transition-opacity duration-300 group-hover:opacity-0">
                                No, I'll Do it Later
                            </span>
                            <ThumbsDown className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-5 h-5 text-gray-500" />
                        </Button>
                    </div>
                </div>
            </CustomDialog>

        </div>
    )
}
