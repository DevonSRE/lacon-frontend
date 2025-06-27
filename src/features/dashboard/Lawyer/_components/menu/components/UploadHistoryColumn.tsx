// components/upload-status-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Download, RotateCcw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type UploadStatus = "Successful" | "Failed" | "Pending Review";

export type UploadItem = {
  caseId: string;
  uploadType: string;
  uploadedOn: string;
  status: string;
};

export const uploadHistoryColumns: ColumnDef<UploadItem>[] = [
  {
    accessorKey: "casefile_id",
    header: "Case ID",
  },
  {
    accessorKey: "update_type",
    header: "Upload Type",
  },
  {
    accessorKey: "document_title",
    header: "Document Title",
  },
  {
    accessorKey: "uploadedOn",
    header: "Uploaded On",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as UploadStatus;

      const statusMap: Partial<Record<UploadStatus, { label: string; className: string }>> = {
        Successful: { label: "Successful", className: "bg-green-100 text-green-700" },
        Failed: { label: "Failed", className: "bg-red-100 text-red-700" },
        "Pending Review": { label: "Pending Review", className: "bg-yellow-100 text-yellow-700" },
      };

      const statusEntry = statusMap[status];

      if (!statusEntry) {
        return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>;
      }

      return <Badge className={statusEntry.className}>{statusEntry.label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const status = row.original.status as UploadStatus;

      switch (status) {
        case "Successful":
          return (
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          );
        case "Failed":
          return (
            <Button variant="ghost" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              Try Again
            </Button>
          );
        case "Pending Review":
          return (
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              Try Again
            </Button>
          );
        default:
          return (
            <Badge className="bg-gray-100 text-gray-700">No Action</Badge>
          );
      }
    },
  },
];
