import React from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { IUser } from "@/types/case";
import { ROLES } from "@/types/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Types
export interface ICase {
  id: string;
  clientName: string;
  first_name: string;
  last_name: string;
  case_type: string;
  state_of_origin: string;
  status: string;
  filedBy: string;
  state: string;
}

// Badge Styling Helpers
export const getStatusBadgeVariant = (status: string) =>
  status === "Assigned" ? "default" : "secondary";

export const getCaseTypeBadgeColor = (caseType: string) => {
  switch (caseType) {
    case "Criminal":
      return "bg-red-100 text-red-800";
    case "Civil":
      return "bg-blue-100 text-blue-800";
    case "Decongestion":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Assign Button Click Handler
const handleAssignClick = (e: React.MouseEvent, caseItem: ICase) => {
  e.stopPropagation();
  // Add assign logic here
};

// Clickable Row Component
const ClickableRow: React.FC<{ row: any }> = ({ row }) => {
  const router = useRouter();

  return (
    <tr
      className="cursor-pointer hover:bg-gray-100"
      onClick={() =>
        router.push(`/cases/view/${encodeURIComponent(row.original.id)}`)
      }
    >
      {row.getVisibleCells().map((cell: any) => (
        <td key={cell.id} className="px-4 py-2 border">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

// Column Generator
export const createCaseColumns = (
  userRole: ROLES,
  type?: "pending" | "all"
): ColumnDef<ICase>[] => {
  const columns: ColumnDef<ICase>[] = [
    {
      id: "select",
      header: () => <Checkbox />,
      cell: ({ row }) => (
        <Checkbox onClick={(e) => e.stopPropagation()} />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Case ID",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "first_name",
      header: "Client Name",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {row.original.first_name} {row.original.last_name}
        </span>
      ),
    },
    {
      accessorKey: "case_type",
      header: "Case Type",
      cell: ({ row }) => (
        <Badge className={getCaseTypeBadgeColor(row.original.case_type)}>
          {row.original.case_type}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const className =
          status === "Assigned"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800";
        return (
          <Badge variant={getStatusBadgeVariant(status)} className={className}>
            {status}
          </Badge>
        );
      },
    },
  ];

  if (userRole === ROLES.PLATFORM_ADMIN || userRole === ROLES.DIRECTOR_GENERAL) {
    // columns.push(
    //   {
    //     accessorKey: "filedBy",
    //     header: "Filed By",
    //     cell: ({ row }) => (
    //       <span className="text-sm text-gray-900">{row.original.filedBy}</span>
    //     ),
    //   },
    // );

    columns.push(
      {
        accessorKey: "state_of_origin",
        header: "State",
        cell: ({ row }) => (
          <span className="text-sm text-gray-900">{row.original.state_of_origin}</span>
        ),
      }
    );
  } else {
    columns.push(
      {
        accessorKey: "assignedBy",
        header: "Assigned By",
        cell: ({ row }) => (
          <span className="text-sm text-gray-900">{row.original.filedBy}</span>
        ),
      },

    );
  }

  columns.push({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const caseItem = row.original;
      const isAssigned = caseItem.status === "Assigned";
      return (
        <Button
          onClick={(e) => handleAssignClick(e, caseItem)}
          variant={isAssigned ? "secondary" : "default"}
          size="sm"
          className={
            isAssigned
              ? "text-gray-600 w-28"
              : "bg-green-600 w-28 hover:bg-green-700"
          }
        >
          {isAssigned ? "Re-Assign" : "Assign"}
        </Button>
      );
    },
  });

  return columns;
};

// CaseTable Component
const CaseTable: React.FC<{ data: ICase[]; userRole: ROLES }> = ({
  data,
  userRole,
}) => {
  const columns = createCaseColumns(userRole);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 border">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <ClickableRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaseTable;
