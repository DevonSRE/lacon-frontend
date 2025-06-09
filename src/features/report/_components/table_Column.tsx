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
    { accessorKey: "active_paralegals", ...centerCell("Active Paralegals") },
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
    { accessorKey: "period", ...centerCell("period") },
    { accessorKey: "received", ...centerCell("Reveived Cases") },
    { accessorKey: "completed", ...centerCell("Completed Cases") },
];
export const offenceComplain: ColumnDef<StateData>[] = [
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
            <div className="text-left">{row.getValue("department")}</div>
        ),
    },
    { accessorKey: "total_cases", ...centerCell("total cases") },
    { accessorKey: "completed_cases", ...centerCell("completed cases") },
    { accessorKey: "resolution_rate", ...centerCell("resolution rate") },
];

export const demographicsTable: ColumnDef<StateData>[] = [
    { accessorKey: "sex", ...centerCell("Sex") },
    { accessorKey: "marital_status", ...centerCell("Marital Status") },
    { accessorKey: "count", ...centerCell("Count") },
];
export const laconLawyerColumns: ColumnDef<StateData>[] = [
    {
        id: "lawyer",
        header: "Lawyer",
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        cell: ({ getValue }) => <div className="text-left">{String(getValue())}</div>,
    },
    { accessorKey: "case_granted", ...centerCell("Cases granted") },
    { accessorKey: "completed", ...centerCell("Completed") },
    { accessorKey: "state_name", ...centerCell("State") },
    { accessorKey: "success_rate", ...centerCell("Success Rate") },
];
export const ProbunoLawyerColumns: ColumnDef<StateData>[] = [
    {
        id: "lawyer",
        header: "Lawyer",
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        cell: ({ getValue }) => <div className="text-left">{String(getValue())}</div>,
    },
    { accessorKey: "case_granted", ...centerCell("Cases granted") },
    { accessorKey: "completed", ...centerCell("Completed") },
    { accessorKey: "state_name", ...centerCell("State") },
    { accessorKey: "success_rate", ...centerCell("Success Rate") },
];

