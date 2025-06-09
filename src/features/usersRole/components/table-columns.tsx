import { IUser } from "@/types/case";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";


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
    accessorKey: "name", // Not splitting first/last name anymore
    header: "Name",
    cell: ({ row }) => {
      const { first_name, last_name, email, avatar } = row.original;
      const fullName = `${first_name} ${last_name}`;
      const initials = `${first_name?.[0] ?? ""}${last_name?.[0] ?? ""}`;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {avatar ? (
              <AvatarImage src={avatar} alt={fullName} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{fullName}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    cell: ({ row }) => (
      <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-md">
        #{row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "user_type",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toUpperCase();
      const statusMap: Record<string, { label: string; color: string }> = {
        ACTIVE: { label: "Active", color: "text-green-700 bg-green-50" },
        PENDING: { label: "Pending", color: "text-blue-600 bg-blue-50" },
        INACTIVE: { label: "Inactive", color: "text-red-800 bg-red-100" },
      };

      const current = statusMap[status] || {
        label: status,
        color: "bg-gray-100 text-gray-800",
      };

      return (
        <span
          className={`inline-flex items-center gap-2 px-2 py-1 text-sm font-medium rounded-md ${current.color}`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          {current.label}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-1 space-y-4">
            <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
              Suspend Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteUser(user)}className="text-red-600" >
              Delete Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const handleSuspendUser = (user: IUser) => {
  // Call API or update state
  console.log("Suspending", user);
};

const handleDeleteUser = (user: IUser) => {
  // Confirm and delete logic
  console.log("Deleting", user);
};

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