import { ILawyerRequest, IUser } from "@/types/case";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { ROLES } from "@/types/auth";

export const createUserColumns = (
  userRole: ROLES,
  onSuspend: (user: IUser) => void,
  onDelete: (user: IUser) => void
): ColumnDef<IUser>[] => {
  return [
    {
      accessorKey: "name",
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
      accessorKey: "user_type",
      header: "Role",
      cell: ({ row }) => {
        const type = row.original.user_type;
        const typeMap: Record<string, string> = {
          ADMIN_LAWYER: "Admin Lawyer",
          LAWYER: "Lawyer",
          // Add more if needed
        };
        return <span>{typeMap[type] ?? type}</span>;
      },
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

        // Optional: restrict actions based on role
        if (userRole !== "ADMIN" && userRole !== "DIRECTOR GENERAL") return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1 space-y-2 bg-gray-50 rounded-xs hover:bg-gray-200 text-xs" >
              <DropdownMenuItem onClick={() => onSuspend(user)}>
                Suspend Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(user)} className="text-red-600">
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export const createLawyerRequestColumns = (
  userRole: ROLES,
  onDetails: (user: ILawyerRequest) => void,
  onApprove: (user: ILawyerRequest) => void,
  onRejeect: (user: ILawyerRequest) => void
): ColumnDef<ILawyerRequest>[] => {
  return [
    {
      accessorKey: "Action",
      header: "Request Type",
      cell: ({ row }) => {
        const action = row.original.Action;
        const actionMap: Record<string, { label: string; color: string }> = {
          Creation: { label: "Create", color: "bg-green-100 text-teal-700" },
          approve: { label: "approve", color: "bg-yellow-100 text-yellow-700" },
          Suspension: { label: "Suspension", color: "bg-yellow-100 text-yellow-700" },
          "Delete Request": { label: "Delete Request", color: "bg-red-100 text-red-600" },
        };

        const current = actionMap[action] ?? {
          label: action,
          color: "bg-gray-100 text-gray-800",
        };

        return (
          <div className={`inline-flex w-52 h-11  items-center px-10 gap-2   py-2 text-sm font-medium rounded-xs ${current.color}`}>
            <input type="checkbox" className="mr-2" />
            {current.label}
          </div>
        );
      },
    },
    {
      accessorKey: "LawyerName",
      header: "Lawyer Name",
      cell: ({ row }) => <span>{row.original.LawyerName}</span>,
    },
    {
      accessorKey: "RequestedName",
      header: "Requested By",
      cell: ({ row }) => <span>{row.original.RequestedName}</span>,
    },
    {
      accessorKey: "Date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.CreatedAt);
        return <span>{date.toISOString().split("T")[0]}</span>;
      },
    },
    {
      accessorKey: "Reason",
      header: "Reason",
      cell: ({ row }) => <span>{row.original.Reason}</span>,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1 space-y-2 bg-gray-50 rounded-xs hover:bg-gray-200 text-xs" >
              <DropdownMenuItem onClick={() => onDetails(user)}>
                Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onApprove(user)}>
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRejeect(user)}>
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

export const createProbunoRequestColumns = (userRole: ROLES,
  onReview: (user: ILawyerRequest) => void): ColumnDef<ILawyerRequest>[] => {
  return [
    {
      accessorKey: "LawyerName",
      header: "Name",
      cell: ({ row }) => <span>{row.original.FirstName} {row.original.LastName}</span>,
    },
    {
      accessorKey: "Experience",
      header: "Experience",
      cell: ({ row }) => <span>{row.original.Experience ?? "-"}</span>,
    },
    {
      accessorKey: "Speciaty",
      header: "Speciaty",
      cell: ({ row }) => <span>{row.original.Speciaty ?? "-"}</span>,
    },
    {
      accessorKey: "MaxLoad",
      header: "Preferred Load",
      cell: ({ row }) => <span>{row.original.MaxLoad}</span>,
    },
    {
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.Status;
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
            {current.label}
          </span>
        );
      },
    },

    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const user = row.original;
        const status = row.original.Status;
        return (
          (status === "pending") ? (
            <Button className="bg-red-500 text-white " onClick={() => onReview(user)}>Review</Button>
          ) : (
            <Button className="bg-gray-500 text-white " onClick={() => onReview(user)}>View</Button>
          )
        );
      },
    },
  ];
};
