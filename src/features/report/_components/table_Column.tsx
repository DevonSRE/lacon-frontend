import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { LawyerData, StateData } from "./report_types";
import { Checkbox } from "@/components/ui/checkbox";

const centerCell = (label: string) => ({
    header: () => <div className="text-center">{label}</div>,
    cell: (info: any) => <div className="text-center">{info.getValue()}</div>,
});

export const stateColumns: ColumnDef<StateData>[] = [
    { accessorKey: "state", ...centerCell("State") },
    { accessorKey: "received", ...centerCell("Received") },
    { accessorKey: "accepted", ...centerCell("Accepted") },
    { accessorKey: "completed", ...centerCell("Completed") },
    { accessorKey: "activeParalegals", ...centerCell("Active Paralegals") },
];


export const lawyerColumns: ColumnDef<LawyerData>[] = [
    {
        accessorKey: "name",
        header: "Lawyer",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Checkbox />
                <span>{row.original.name}</span>
            </div>
        ),
    },
    { accessorKey: "casesGranted", header: "Cases Granted" },
    { accessorKey: "completed", header: "Completed" },
    { accessorKey: "roles", header: "Roles" },
];


export const CorrectionalCenterVisit: ColumnDef<StateData>[] = [
    { accessorKey: "Center", ...centerCell("Center") },
    { accessorKey: "Visits", ...centerCell("Visits") },
    { accessorKey: "InMates Assisted", ...centerCell("InMates Assisted") },
    { accessorKey: "Legal Rep Provided", ...centerCell("Legal Rep Provided") },
];
export const PdssBailatStation: ColumnDef<StateData>[] = [
    { accessorKey: "station", ...centerCell("station") },
    { accessorKey: "Release Individual", ...centerCell("Release Individual") },
    { accessorKey: "Gender", ...centerCell(" Gender") },
    { accessorKey: "Offenses", ...centerCell("Offenses") },
];
export const BiAnnualStatistic: ColumnDef<StateData>[] = [
    { accessorKey: "Period", ...centerCell("Period") },
    { accessorKey: "Approved Cases", ...centerCell("Approved Cases") },
    { accessorKey: "Completed Cases", ...centerCell("Completed Cases") },
];
export const offenceComplain: ColumnDef<StateData>[] = [
    { accessorKey: "Types", ...centerCell("Types") },
    { accessorKey: "Count", ...centerCell("Count") },
    { accessorKey: "criminal", ...centerCell("criminal") },
    { accessorKey: "Civil", ...centerCell("Civil") },
    { accessorKey: "Resolution Rate", ...centerCell("Resolution Rate") },
];

export const demographicsTable: ColumnDef<StateData>[] = [
    { accessorKey: "Sex", ...centerCell("Sex") },
    { accessorKey: "Marital Status", ...centerCell("Marital Status") },
    { accessorKey: "Count", ...centerCell("Count") },
];