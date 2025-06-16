import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
export default function LawyersReportTable({ tableData }: { tableData: any[] }) {
    return (
        <Table className="mt-4">
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <input type="checkbox" />
                    </TableHead>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Client Title</TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Case type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Next Action</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                        <TableCell>
                            <input type="checkbox" />
                        </TableCell>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.case_title ?? "-"}</TableCell>
                        <TableCell>{row.first_name}</TableCell>
                        <TableCell>{row.case_type}</TableCell>
                        <TableCell>
                            <span className="text-red-500 bg-red-100 px-2 py-1 rounded-full">
                                {row.status}
                            </span>
                        </TableCell>
                        <TableCell>{row.dueDate}</TableCell>
                        <TableCell>
                           -
                        </TableCell>
                        <TableCell>
                            <Button variant="secondary">View</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}