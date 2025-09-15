import { CaseOverview } from "@/types/case";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

export const mainColumns: ColumnDef<CaseOverview>[] = [
  {
    accessorKey: "case_type",
    header: () => <div className="text-center font-semibold text-lg">Case Type</div>,
    cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>,
  },
  {
    accessorKey: "department_name",
    header: () => <div className="text-center font-semibold  text-lg">Forwarded by</div>,
    cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center text-lg">Status</div>,
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
];
