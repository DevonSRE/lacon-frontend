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
import TableContentLoader from "@/components/table-content-loader";
import { Table } from "@/components/ui/table";

import { useState } from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";


// Clickable Row
const ClickableRow: React.FC<{ row: any }> = ({ row }) => {
  const router = useRouter();

  return (
    <tr
      className="cursor-pointer hover:bg-gray-100"
      onClick={() =>
        router.push(`/cases/view/${encodeURIComponent(row.original.user_id)}`)
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

// Suspend / Delete Handlers
const handleSuspendUser = (user: IUser) => {
  console.log("Suspending", user);
};

const handleDeleteUser = (user: IUser) => {
  console.log("Deleting", user);
};




export const createUserColumns = (
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

// // Column Generator
// export const createUserColumns = (
//   userRole: ROLES,
//   type?: "pending" | "all"
// ): ColumnDef<IUser>[] => {
//   const columns: ColumnDef<IUser>[] = [
//     {
//       accessorKey: "name",
//       header: "Name",
//       cell: ({ row }) => {
//         const { first_name, last_name, email, profile_image: avatar } = row.original;
//         const fullName = `${first_name} ${last_name}`;
//         const initials = `${first_name?.[0] ?? ""}${last_name?.[0] ?? ""}`;

//         return (
//           <div className="flex items-center gap-3">
//             <Avatar className="h-8 w-8">
//               {avatar ? (
//                 <AvatarImage src={avatar} alt={fullName} />
//               ) : (
//                 <AvatarFallback>{initials}</AvatarFallback>
//               )}
//             </Avatar>
//             <div className="flex flex-col">
//               <span className="font-medium text-sm">{fullName}</span>
//               <span className="text-xs text-muted-foreground">{email}</span>
//             </div>
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "user_id",
//       header: "User ID",
//       cell: ({ row }) => (
//         <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-md">
//           {/* #{row.original.user_id} */}
//           #{row.original.id}
//         </span>
//       ),
//     },
//     {
//       accessorKey: "user_type",
//       header: "Role",
//     },
//   ];

//   if (userRole === ROLES.CIVIL_JUSTICE_DEPT) {
//     columns.push(
//       {
//         accessorKey: "state",
//         header: "State",
//       },
//       {
//         accessorKey: "case_assignment",
//         header: "Case Assignment",
//       }
//     );
//   }

//   columns.push(
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => {
//         const status = row.original.status.toUpperCase();
//         const statusMap: Record<string, { label: string; color: string }> = {
//           ACTIVE: { label: "Active", color: "text-green-700 bg-green-50" },
//           PENDING: { label: "Pending", color: "text-blue-600 bg-blue-50" },
//           INACTIVE: { label: "Inactive", color: "text-red-800 bg-red-100" },
//         };

//         const current = statusMap[status] || {
//           label: status,
//           color: "bg-gray-100 text-gray-800",
//         };

//         return (
//           <span
//             className={`inline-flex items-center gap-2 px-2 py-1 text-sm font-medium rounded-md ${current.color}`}
//           >
//             <span className="h-2 w-2 rounded-full bg-current" />
//             {current.label}
//           </span>
//         );
//       },
//     },
//     {
//       id: "actions",
//       header: "",
//       cell: ({ row }) => {
//         const user = row.original;

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="p-1 space-y-2">
//               {(userRole !== ROLES.PLATFORM_ADMIN && userRole !== ROLES.DIRECTOR_GENERAL) && (
//                 <>
//                   <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
//                     View
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
//                     Edit
//                   </DropdownMenuItem>
//                 </>
//               )}
//               <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
//                 Suspend Account
//               </DropdownMenuItem>
//               {(userRole === ROLES.PLATFORM_ADMIN || userRole === ROLES.DIRECTOR_GENERAL) && (
//                 <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600">
//                   Delete Account
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu >
//         );
//       },
//     }
//   );

//   return columns;
// };

