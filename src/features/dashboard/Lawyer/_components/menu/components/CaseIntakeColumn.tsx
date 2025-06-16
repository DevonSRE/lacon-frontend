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
};

export const caseIntakColumns: ColumnDef<CaseType>[] = [
  {
    header: "Case ID",
    accessorKey: "case_id",
  },
  {
    header: "Client Name",
    accessorKey: "client_name",
  },
  {
    header: "Contact",
    accessorKey: "contact",
  },
  {
    header: "Case Type",
    accessorKey: "case_type",
  },
  {
    header: "Case Summary",
    accessorKey: "case_summary",
    cell: ({ getValue }) => (
      <div className="max-w-xs truncate text-ellipsis">{getValue() as string}</div>
    ),
  },
  {
    header: "Date Submitted",
    accessorKey: "date_submitted",
  },
  {
    header: "Created By",
    accessorKey: "created_by",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const baseClass = "rounded-full px-3 py-1 text-sm font-semibold";
      const statusClass =
        status === "Rejected"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700";

      return <span className={`${baseClass} ${statusClass}`}>{status}</span>;
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
