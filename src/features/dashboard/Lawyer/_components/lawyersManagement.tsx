import LawyerTotalCase from "../../../report/charts/LaywerTotalCase";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function Lawyers() {


    type LawyerStatus = keyof typeof statusColors;

    interface Lawyer {
        name: string;
        role: string;
        state: string;
        cases: number;
        status: LawyerStatus;
    }

    const lawyers: Lawyer[] = [
        { name: "Mathew Paulson A.", role: "Probono Lawyer", state: "Lagos", cases: 12, status: "Inactive" },
        { name: "Sofia Tran", role: "Corporate Lawyer", state: "Nairobi", cases: 8, status: "Active" },
        { name: "Jamal Rivers", role: "Criminal Defense At", state: "Chicago", cases: 10, status: "Inactive" },
        { name: "Nina Gomez", role: "Family Lawyer", state: "Madrid", cases: 5, status: "Active" },
        { name: "Liam O'Reilly", role: "Intellectual Propert", state: "Dublin", cases: 15, status: "Active" },
    ];

    const statusColors = {
        Active: "bg-green-100 text-green-600",
        Inactive: "bg-yellow-100 text-yellow-600",
    };


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Lawyer Management</h1>
                <Button className="bg-red-600 text-white">Add New Lawyer</Button>
            </div>

            <div className="flex items-center border rounded-md px-4 py-2 w-full max-w-lg mb-4">
                <Input placeholder="Search By name" className="border-0 focus-visible:ring-0" />
                <Button variant="outline">Filter</Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><Checkbox /></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>State</TableHead>
                                <TableHead>Case Assignment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lawyers.map((lawyer, idx) => (
                                <TableRow key={idx}>
                                    <TableCell><Checkbox /></TableCell>
                                    <TableCell>{lawyer.name}</TableCell>
                                    <TableCell>{lawyer.role}</TableCell>
                                    <TableCell>{lawyer.state}</TableCell>
                                    <TableCell>{lawyer.cases}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 text-sm rounded-md ${statusColors[lawyer.status]}`}>
                                            {lawyer.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button size="sm" className="bg-black text-white">Edit</Button>
                                        <Button size="sm" variant="outline">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex justify-between items-center mt-4">
                <Button variant="outline" className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <span className="text-sm">1</span>
                <Button variant="outline" className="flex items-center gap-2">
                    Next <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}


