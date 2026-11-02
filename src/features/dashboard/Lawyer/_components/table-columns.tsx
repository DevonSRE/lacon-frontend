import React from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ILawyerManagement, IUser } from "@/types/case";
import { ROLES } from "@/types/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ban, MoreHorizontal, MoreVerticalIcon, Pencil, Trash2 } from "lucide-react";
import TableContentLoader from "@/components/table-content-loader";
import { Table } from "@/components/ui/table";

import { useState } from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { displayStateName } from "@/lib/place-names";
import { pendingChangeNote, userStatusBadge } from "@/lib/user-status";


// Clickable Row
const ClickableRow: React.FC<{ row: Row<IUser> }> = ({ row }) => {
  const router = useRouter();

  return (
    <tr
      className="cursor-pointer hover:bg-gray-100"
      onClick={() =>
        router.push(`/cases/view/${encodeURIComponent(row.original.user_id)}`)
      }
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-4 py-2 border">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

// Suspend / Delete Handlers: stubs, not wired to the API yet.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleSuspendUser = (_user: IUser) => { };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleDeleteUser = (_user: IUser) => { };

export const createLawyersColumns = (
  userRole: ROLES,
  onView: (user: IUser) => void,
  onEdit: (user: IUser) => void
): ColumnDef<IUser>[] => {
  const columns: ColumnDef<IUser>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const { first_name, last_name, email, profile_image: avatar } = row.original;
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
  ];

  if (userRole === ROLES.CIVIL_JUSTICE_DEPT) {
    columns.push(
      {
        accessorKey: "state",
        header: "State",
        cell: ({ row }) => displayStateName(row.original.state),
      },
      {
        accessorKey: "case_assignment",
        header: "Case Assignment",
      }
    );
  }

  columns.push(
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const current = userStatusBadge(row.original.status, row.original.probono_decision);

        return (
          <span className={`inline-flex items-center gap-2 px-2 py-1 text-sm font-medium rounded-md ${current.color}`}>
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
            <DropdownMenuContent align="end" className="p-1 space-y-2">
              {(userRole !== ROLES.PLATFORM_ADMIN && userRole !== ROLES.DIRECTOR_GENERAL) && (
                <>
                  <DropdownMenuItem onClick={() => onView(user)}>
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(user)}>
                    Edit
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
                Suspend Account
              </DropdownMenuItem>
              {(userRole === ROLES.PLATFORM_ADMIN || userRole === ROLES.DIRECTOR_GENERAL) && (
                <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600">
                  Delete Account
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
  );

  return columns;
};

export const createLawyersManagementColumns = (
  userRole: ROLES,
  onView: (user: ILawyerManagement) => void,
  onEdit: (user: ILawyerManagement) => void,
  onSuspend: (user: ILawyerManagement) => void,
  onDelete: (user: ILawyerManagement) => void
): ColumnDef<ILawyerManagement>[] => {
  const columns: ColumnDef<ILawyerManagement>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const { first_name, last_name, email, profile_image: avatar } = row.original;
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
      accessorKey: "phone_number",
      header: "Phone",
    },
    {
      accessorKey: "user_type",
      header: "Role",
    },
    {
      // The list showed no workload at all, so a coordinator could not tell who
      // was free before assigning (QA 2026-11-01, item 25). The API counts this
      // live from the cases, so it cannot drift.
      accessorKey: "open_cases",
      header: "Open cases",
      cell: ({ row }) => {
        const open = row.original.open_cases;
        return open === undefined
          ? <span className="text-sm text-muted-foreground">-</span>
          : <span className="text-sm">{open}{open === 0 ? " (free)" : ""}</span>;
      },
    },
    {
      accessorKey: "zone_name",
      header: "Zone",
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => displayStateName(row.original.state),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const current = userStatusBadge(row.original.status, row.original.probono_decision);
        const waiting = pendingChangeNote(row.original.pending_change);

        return (
          <div className="space-y-1">
            <span className={`inline-flex items-center gap-2 px-2 py-1 text-sm font-medium rounded-md ${current.color}`}>
              <span className="h-2 w-2 rounded-full bg-current" />
              {current.label}
            </span>
            {waiting && <p className="text-xs text-blue-600">{waiting}</p>}
          </div>
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
              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Lawyer actions">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1 space-y-2 border-[1px] border-black bg-gray-50">
              {(userRole !== ROLES.PLATFORM_ADMIN && userRole !== ROLES.DIRECTOR_GENERAL) && (
                <>
                  <DropdownMenuItem onClick={() => onView(user)}>
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(user)}>
                    Edit
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem disabled={!!user.pending_change} onClick={() => onSuspend(user)}>
                Request suspension
              </DropdownMenuItem>


            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};


