"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { DataTable } from "@/components/data-table";
import TablePagination from "@/components/TablePagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/icons/icons";
import { useAction } from "@/context/ActionContext";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { ILawyerRequest } from "@/types/case";
import { AddLawyerSheet } from "../dashboard/Lawyer/_components/addLawyer";
import { GetLawyerRequestAction } from "./userRoleAction";
import { roleLabel } from "@/lib/role-labels";

/**
 * What a field office has asked the Director General for, and what came back.
 *
 * The API has always scoped this endpoint to the caller's own requests
 * (`ListLawyerUnitRequests` sets `mine` for anyone who is not an approver), but
 * a coordinator or unit head had no page that showed them, so the only way to
 * learn a decision was to be told (QA 2026-11-01, item 3).
 */
const ACTIONS: Record<string, string> = {
  ADD: "New account",
  DEACTIVATE: "Deactivate",
  REACTIVATE: "Reactivate",
};

const STATUSES: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Waiting for the Director General", color: "text-blue-600 bg-blue-50" },
  APPROVED: { label: "Approved", color: "text-green-700 bg-green-50" },
  REJECTED: { label: "Not approved", color: "text-red-800 bg-red-100" },
};

const raisedOn = (raw?: string) => {
  const date = raw ? new Date(raw) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "-";
};

const columns: ColumnDef<ILawyerRequest>[] = [
  {
    accessorKey: "Action",
    header: "Request",
    cell: ({ row }) => {
      const action = (row.original.Action ?? "").toUpperCase();
      return (
        <div>
          <p className="font-medium">{ACTIONS[action] ?? action ?? "-"}</p>
          <p className="text-xs text-gray-500">{roleLabel(row.original.ProposedUserType) || "-"}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "LawyerName",
    header: "For",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.LawyerName || "-"}</p>
        <p className="text-xs text-gray-500">{row.original.LawyerEmail || row.original.Email || ""}</p>
      </div>
    ),
  },
  {
    accessorKey: "Reason",
    header: "Your reason",
    cell: ({ row }) => <span className="text-sm">{row.original.Reason || "-"}</span>,
  },
  {
    accessorKey: "CreatedAt",
    header: "Raised",
    cell: ({ row }) => <span className="whitespace-nowrap">{raisedOn(row.original.CreatedAt)}</span>,
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original.Status ?? "").toUpperCase();
      const current = STATUSES[status] ?? { label: status, color: "bg-gray-100 text-gray-800" };
      return (
        <span className={`inline-flex whitespace-nowrap items-center rounded-md px-2 py-1 text-sm font-medium ${current.color}`}>
          {current.label}
        </span>
      );
    },
  },
  {
    accessorKey: "DecisionReason",
    header: "What they said",
    cell: ({ row }) => {
      const status = (row.original.Status ?? "").toUpperCase();
      const reason = row.original.DecisionReason?.trim();
      if (status === "PENDING") return <span className="text-sm text-gray-500">No decision yet</span>;
      return <span className="text-sm">{reason || "No reason was given"}</span>;
    },
  },
];

export default function MyRequests() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const { setIsOpen } = useAction();

  const { data, isLoading } = useQuery({
    queryKey: ["getMyLawyerRequests", currentPage, debouncedSearchTerm],
    queryFn: async () =>
      GetLawyerRequestAction({
        page: currentPage,
        size: DEFAULT_PAGE_SIZE,
        keyword: debouncedSearchTerm || "",
      }),
    staleTime: 60000,
  });

  const rows: ILawyerRequest[] = useMemo(() => data?.data?.data ?? [], [data]);
  const total = data?.data?.total_rows ?? 0;

  return (
    <>
      <AddLawyerSheet />
      <div className="mx-4 flex flex-1 flex-col gap-6 pt-0 lg:mx-0">
        <div className="row flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">My requests</h1>
            <p className="text-sm text-gray-500">
              Accounts you have asked the Director General to add or change, and what they decided.
            </p>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="h-11 rounded-sm bg-red-600 text-white hover:bg-red-700"
          >
            <Icons.plusIcon className="mr-2" />
            Request a user
          </Button>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 w-4 -translate-y-1/2 text-neutral" />
          <Input
            type="search"
            name="searchTerm"
            autoComplete="off"
            data-form-type="other"
            placeholder="Search by the name you asked for"
            className="h-11 w-full pl-9"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <DataTable
          columns={columns}
          loading={isLoading}
          data={rows}
          emptyMessage="You have not raised any requests yet. Use Request a user to ask for one."
        />

        {total > DEFAULT_PAGE_SIZE && (
          <div className="flex justify-end pt-4">
            <TablePagination
              currentPage={currentPage}
              totalCount={total}
              pageSize={DEFAULT_PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </>
  );
}
