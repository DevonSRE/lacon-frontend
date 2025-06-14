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
  filed_date: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  status: string;
  filed_by: string;
  state: string;
  case_type: string; // e.g., "PDSS ORGANIZATION" or "CIVIL CASE"
  location: string; // General location
  name: string;
  sex: string;
  age: number;
  marital_status: string;
  disability: string; // From disability_status
  phone_number: string;
  email: string;
  occupation: string;
  state_of_origin: string;

  // Optional groupings for specific case types:
  pdss?: {
    offence: string;
    client_location: string;
    days_in_detention: number;
    counsel_or_paralegal: string;
    counsel_designation: string;
    counsel_firm_or_org_id: string;
    nature_of_legal_service: string;
    case_status: string;
    bail_status: string;
    date_trial_ended: string;
    case_outcome: string;
  };

  civil_case?: {
    casefile_id: string;
    complaint: string;
    average_income: string;
    legal_aid_reason: string;
    number_of_dependants: number;
    registration_number: string;
    case_number: string;
    court_of_hearing: string;
    defendant_name: string;
    defendant_address: string;
    defendant_phone_number: string;
  };
  judiciary?: {
    case_number: string;
    bail_status: string;
    trial_of_court: string;
    prosecuting_agency: string;
    current_case_status: string;
  };
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


export const createCaseColumns = (
  userRole: ROLES,
  onAssign: (caseItem: ICase) => void,
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
          status === "ASSIGNED"
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
    columns.push({
      accessorKey: "state_of_origin",
      header: "State",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.state_of_origin}</span>
      ),
    });
  } else {
    columns.push({
      accessorKey: "assignedBy",
      header: "Assigned By",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.filed_by}</span>
      ),
    });
  }

  columns.push({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const caseItem = row.original;
      const isAssigned = caseItem.status === "ASSIGNED";
      return (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAssign(caseItem);
          }}
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