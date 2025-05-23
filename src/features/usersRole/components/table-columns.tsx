import { IUser } from "@/types/case";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";

const ClickableRow: React.FC<{ row: any }> = ({ row }) => {
  const router = useRouter();

  return (
    <tr
      className="cursor-pointer hover:bg-gray-100"
      onClick={() => router.push(`/cases/view/${encodeURIComponent(row.original.caseId)}`)}
      style={{ cursor: "pointer" }} // Ensure pointer applies
    >
      {row.getVisibleCells().map((cell: any) => (
        <td key={cell.id} className="px-4 py-2 border">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};
export const mainColumns: ColumnDef<IUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors: Record<string, string> = {
        ACTIVE: "bg-green-50 text-green-700",
        PENDING: "bg-blue-50 text-blue-600",
        INACTIVE: "bg-red-100 text-red-800",
      };

      return (
        <span
          className={`px-2 py-1 rounded-md text-sm font-medium ${statusColors[status.toUpperCase()] || "bg-gray-100 text-gray-800"
            }`}
        >
          {status}
        </span>
      );
    },
  },
];


const CaseTable: React.FC<{ data: IUser[] }> = ({ data }) => {
  const table = useReactTable({
    data,
    columns: mainColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-4 py-2 border">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="block w-full">
          {table.getRowModel().rows.map(row => (
            <ClickableRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaseTable;