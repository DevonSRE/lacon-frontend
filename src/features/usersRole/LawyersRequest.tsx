'use client';

import React, { startTransition, useActionState, useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { createLawyerRequestColumns, createUserColumns } from "./components/table-columns";
import { useQuery } from "@tanstack/react-query";
import TablePagination from "@/components/TablePagination";
import { Button } from "@/components/ui/button";
import { Filter, ListFilter, Plus, Search } from "lucide-react";
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
import { ApproveRejectLawyerRequest } from "../dashboard/server/action";
import TextAreaField from "@/components/TextAreaField";
import { Card, CardContent } from "@/components/ui/card";
import { set } from "zod";





export default function LawyersRequest() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const { setIsOpen } = useAction();
    const [Actiontype, setActiontype] = useState<ROLES | undefined>(undefined);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const { data: user } = useAppSelector((state) => state.profile);
    const [selectedUser, setSelectedUser] = useState<ILawyerRequest | null>(null);
    const [openDetails, setDetailsDailog] = useState(false);
    const [openApprove, setApproveDailog] = useState(false);
    const [openReject, setRejectDailog] = useState(false);
    const [sheetType, setSheetType] = useState<"details" | "approve" | "reject" | null>(null);
    const [state, dispatch, isPending] = useActionState(ApproveRejectLawyerRequest, undefined);

    const handleOpenSheet = (user: ILawyerRequest, type: "details" | "approve" | "reject") => {
        setSelectedUser(user);
        setSheetType(type);
        if (type === "details") setDetailsDailog(true);
        if (type === "approve") setApproveDailog(true);
        if (type === "reject") setRejectDailog(true);
    };
    const handleOpenDetailsSheet = (user: ILawyerRequest) => {
        setSelectedUser(user);
        setDetailsDailog(true);
    };
    const columns = useMemo(
        () =>
            createLawyerRequestColumns(user?.role as ROLES,
                (user) => handleOpenSheet(user, "details"),
                (user) => handleOpenSheet(user, "approve"),
                (user) => handleOpenSheet(user, "reject"),
            ),
        [user?.role]
    );


    const { data, isLoading } = useQuery({
        queryKey: ["getLawyersRequest", currentPage, debouncedSearchTerm, Actiontype],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
                keyword: debouncedSearchTerm ?? "",
                action: Actiontype ?? "",
            };
            return await GetLawyerRequestAction(filters);
        },
        staleTime: 100000,
    });

    const actionType: string[] = [
        "Creation", "Suspension", "approve"
    ];

    const handleActionType = (role: any) => {
        setActiontype(role === "All" ? undefined : role);
        const searchInput = document.getElementsByName("searchTerm")[0] as HTMLInputElement;
        if (searchInput) searchInput.value = "";
    };

    const dispatchAction = (type: "approve" | "reject") => {
        startTransition(() => {
            const formData = new FormData();
            formData.append("id", String(selectedUser?.id));
            formData.append("type", String(type));
            // dispatch(formData);
        });

    };

    return (
        <>
            <AddUserSheet />
            <div className="flex flex-1 flex-col gap-6 pt-0 mx-4 lg:mx-0">
                <div className="row flex justify-between">
                    <div className="text-2xl font-semibold">Lawyer & Unit Request</div>
                    <Button onClick={() => setIsOpen(true)} className="bg-red-600 hover:bg-red-700 text-white h-11 rounded-sm">
                        <Icons.plusIcon className="mr-2" />
                        New User
                    </Button>
                </div>
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
                                    {Actiontype ?? "All Action Type"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="h-auto space-y-2 space-x-2 overflow-y-auto">
                                <DropdownMenuCheckboxItem
                                    checked={!Actiontype}
                                    onCheckedChange={() => handleActionType("All")}>
                                    All
                                </DropdownMenuCheckboxItem>
                                {actionType.map((tab) => (
                                    <DropdownMenuCheckboxItem checked={Actiontype === tab} onClick={() => handleActionType(tab)}>
                                        {tab}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </section>
                </div>
                <DataTable onRowClick={handleOpenDetailsSheet} columns={columns} loading={isLoading} data={data?.data.data} />
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


                <CustomDialog open={openDetails} setOpen={setDetailsDailog} className="w-lg">
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-4">Request Details</h2>
                        <div className="space-y-4">
                            <DetailItem label="Request Type:" value="Creation" />
                            <DetailItem label="Lawyer Name:" value="Olumide Bakare" />
                            <DetailItem label="Requested By:" value="Zonal Directors" />
                            <DetailItem label="Date:" value="2025-06-06" />
                            <DetailItem label="Status:" value="Pending" />
                            <DetailItem label="Reason:" value="New staff recruitment" />
                            <div>
                                <span className="font-medium">Details:</span>
                                <Card className="mt-2 bg-gray-100">
                                    <CardContent className="text-sm text-gray-800">
                                        Request to add new staff lawyer to handle increased caseload in civil
                                        justice department. Lawyer has 5 years experience in civil litigation.
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-3 gap-4">
                            <Button className="bg-green-700 hover:bg-green-800 h-12 w-full" onClick={() => { setDetailsDailog(false); setApproveDailog(true); }} >Approve Request</Button>
                            <Button variant="destructive" className="h-12 w-full" onClick={() => { setDetailsDailog(false); setRejectDailog(true); }}>Reject Request</Button>
                            <Button variant="outline" onClick={() => setDetailsDailog(false)} className="h-12 w-full">No, Cancel</Button>
                        </div>
                    </div>
                </CustomDialog>
                <CustomDialog open={openApprove} setOpen={setApproveDailog} className="w-xl">
                    <div className="space-y-5">
                        <div className="flex text-xl font-semibold justify-center text-center">Approval Request</div>
                        <div className="justify-center text-center">Are You Sure You Want To Approvet this request</div>
                        <div className="p-1">
                            <TextAreaField name="permanent_address" className="focus:ring-black-500 border-black" label="" placeholder="Add any note for the record" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button onClick={() => dispatchAction("approve")} className="w-full h-11 bg-[#006458] text-white border-0  ">
                                {isPending ? "Approving..." : " Yes, Approve"}
                            </Button>
                            <Button variant={"outline"} className="w-full h-11 border-black border-2" onClick={() => setApproveDailog(false)}>
                                No, Cancel
                            </Button>
                        </div>
                    </div>
                </CustomDialog>
                <CustomDialog open={openReject} setOpen={setRejectDailog} className="w-xl">
                    <div className="mt-4">
                        <div className="space-y-5">
                            <div className="flex text-xl font-semibold justify-center text-center">Reject Request</div>
                            <div className="justify-center text-center">Please confirm you want to reject this request</div>
                            <div className="p-1">
                                <TextAreaField name="permanent_address" className="focus:ring-black-500 border-black" label="" placeholder="Please specify the reason here..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button onClick={() => dispatchAction("approve")} className="w-full h-11 bg-red-500 text-white border-0  ">
                                    {isPending ? "Rejecting..." : " Confirm, Rejection"}
                                </Button>
                                <Button variant={"outline"} className="w-full h-11 border-black border-2" onClick={() => setRejectDailog(false)}>
                                    No, Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </CustomDialog>

            </div>
        </>

    )
}

const DetailItem = ({ label, value, }: { label: string; value: string; }) => (
    <div className="flex justify-between">
        <span className="text-gray-600">{label}</span>
        <span className={`text-right font-semibold`}>{value}</span>
    </div>
);
