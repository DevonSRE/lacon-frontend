import { CaseOverview } from "@/types/case";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";

// The overview rows are raw casefiles; the date field name varies with the API model.
const filedOn = (row: CaseOverview & { created_at?: string; CreatedAt?: string }) => {
  const raw = row.created_at ?? row.CreatedAt;
  const date = raw ? new Date(raw) : null;
  return date && !isNaN(date.getTime()) ? date.toLocaleDateString("en-GB") : "-";
};
const clientName = (row: CaseOverview) =>
  [row.first_name, row.last_name].filter(Boolean).join(" ");

export const mainColumns: ColumnDef<CaseOverview>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-left font-semibold text-base">Case ID</div>,
    cell: ({ row }) => (
      <div className="text-left font-mono text-xs" title={row.original.id}>
        {row.original.id?.slice(0, 8) ?? "-"}
      </div>
    ),
  },
  {
    id: "client",
    header: () => <div className="text-left font-semibold text-base">Client</div>,
    cell: ({ row }) => <div className="text-left">{clientName(row.original) || "-"}</div>,
  },
  {
    id: "filed_on",
    header: () => <div className="text-left font-semibold text-base">Date Filed</div>,
    cell: ({ row }) => <div className="text-left">{filedOn(row.original)}</div>,
  },
  {
    accessorKey: "case_type",
    header: () => <div className="text-left font-semibold text-base">Case Type</div>,
    cell: ({ getValue }) => <div className="text-left">{getValue() as string}</div>,
  },
  {
    accessorKey: "department_name",
    header: () => <div className="text-center font-semibold  text-base">Forwarded by</div>,
    cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center text-base">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status || "Unknown";
      const statusColors: Record<string, string> = {
        Active: "bg-green-50 text-green-700 border border-green-200",
        Pending: "bg-blue-50 text-blue-600 border border-blue-200",
        Inactive: "bg-red-50 text-red-700 border border-red-200",
        Unknown: "bg-gray-50 text-gray-700 border border-gray-200",
      };
      return (
        <div className="flex justify-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    id: "action",
    header: () => <div className="text-center text-base">Action</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Link
          // The API matches search against one column at a time, so "First Last" never matches.
          href={`/cases?search=${encodeURIComponent(row.original.first_name ?? "")}`}
          className="text-red-600 hover:underline text-sm font-medium"
        >
          Open case
        </Link>
      </div>
    ),
  },
];
