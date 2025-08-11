import { CaseOverview } from "@/types/case";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

export const mainColumns: ColumnDef<CaseOverview>[] = [
  {
    accessorKey: "case_type",
    header: "Case Type",
  },
  {
    accessorKey: "department_name",
    header: "Department",
  },
  // {
  //   accessorKey: "priority",
  //   header: "Priority",
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "Unknown";
      const statusColors: Record<string, string> = {
        Active: "bg-green-50 text-green-700 border border-green-200",
        Pending: "bg-blue-50 text-blue-600 border border-blue-200",
        Inactive: "bg-red-50 text-red-700 border border-red-200",
        Unknown: "bg-gray-50 text-gray-700 border border-gray-200",
      };
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      );
    },
  },
  // {
  //   accessorKey: "action",
  //   header: "Action",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex items-center gap-2">
  //         <button
  //           className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 border rounded-md transition-colors"
  //           onClick={() => {
  //             // Handle view action
  //             // console.log("View case:", row.original.case_id);
  //           }}>
  //           Assign
  //         </button>

  //       </div>
  //     );
  //   },
  // },
];