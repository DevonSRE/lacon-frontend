import { ColumnDef } from "@tanstack/react-table";

type CaseType = {
  case_id: string;
  client_name: string;
  contact: string;
  case_type: string;
  case_summary: string;
  date_submitted: string;
  created_by: string;
  status: "Pending" | "Rejected";
  created_at: string; // Make sure this field is present
};

export const caseIntakColumns: ColumnDef<CaseType>[] = [
  {
    header: "Client Name",
    accessorKey: "principal_name",
  },
  {
    header: "Lawyer Name",
    accessorKey: "lawyer_name",
  },
  {
    header: "Date Submitted",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    header: "Actions",
    cell: () => (
      <button className="rounded bg-gray-700 px-4 py-1 text-white hover:bg-gray-800">
        Edit
      </button>
    ),
  },
];
