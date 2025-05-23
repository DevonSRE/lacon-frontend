'use client'
import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SearchFilterSection from './_components/SearchFilterSection';
import CaseDetailsSheet from './_components/CaseDetailsSheet';
import { TCase } from '@/lib/types';
import { AssignmentSheet } from './_components/AssignmentSheet';
// Remove any import of 'Case' from './_components/CaseDetailsSheet' or other files in this file.
// export interface Case {
//     id: string;
//     clientName: string;
//     caseType: 'Criminal' | 'Civil' | 'Decongestion';
//     status: 'Assigned' | 'Unassigned';
//     filedBy: string;
//     state: string;
// }

const casesData: TCase[] = [
    { id: 'LCN - 001', clientName: 'Adaobi Nwankwo', caseType: 'Criminal', status: 'Unassigned', filedBy: 'Paralegal', state: 'Oyo' },
    { id: 'LCN - 001', clientName: 'Chinonso Okafor', caseType: 'Civil', status: 'Assigned', filedBy: 'Paralegal', state: 'Enugu' },
    { id: 'LCN - 001', clientName: 'Emeka Uche', caseType: 'Decongestion', status: 'Unassigned', filedBy: 'Paralegal', state: 'Kano' },
    { id: 'LCN - 001', clientName: 'Ifu Eze', caseType: 'Criminal', status: 'Assigned', filedBy: 'Paralegal', state: 'Rivers' },
    { id: 'LCN - 001', clientName: 'Chijioke Nwosu', caseType: 'Decongestion', status: 'Unassigned', filedBy: 'Paralegal', state: 'Abia' },
    { id: 'LCN - 001', clientName: 'Ngozi Obi', caseType: 'Criminal', status: 'Assigned', filedBy: 'Paralegal', state: 'Benue' },
    { id: 'LCN - 001', clientName: 'Ifeoma Chukwu', caseType: 'Criminal', status: 'Unassigned', filedBy: 'Paralegal', state: 'Ekiti' },
    { id: 'LCN - 001', clientName: 'Obinna Nnamdi', caseType: 'Criminal', status: 'Assigned', filedBy: 'Paralegal', state: 'Lagos' },
    { id: 'LCN - 001', clientName: 'Chinwe Ndukwe', caseType: 'Decongestion', status: 'Unassigned', filedBy: 'Paralegal', state: 'Yobe' },
    { id: 'LCN - 001', clientName: 'Ugochukwu Nwafor', caseType: 'Criminal', status: 'Assigned', filedBy: 'Paralegal', state: 'Sokoto' },
];

const lawyers = [
    'John Adebayo',
    'Sarah Okonkwo',
    'Michael Usman',
    'Grace Okoro',
    'David Lawal'
];

export default function CasesPage() {
    const [selectedCase, setSelectedCase] = useState<TCase | null>(null);
    const [showCaseDetails, setShowCaseDetails] = useState(false);
    const [showAssignSheet, setShowAssignSheet] = useState(false);
    const [assignmentCase, setAssignmentCase] = useState<TCase | null>(null);
    const [clientNameSearch, setClientNameSearch] = useState('');
    const [caseIdSearch, setCaseIdSearch] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [caseTypeFilter, setCaseTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const handleRowClick = (caseItem: TCase) => {
        setSelectedCase(caseItem);
        setShowCaseDetails(true);
    };

    const handleAssignClick = (e: React.MouseEvent, caseItem: TCase) => {
        e.stopPropagation();
        setAssignmentCase(caseItem);
        setShowAssignSheet(true);
    };

    const getStatusBadgeVariant = (status: string) => {
        return status === 'Assigned' ? 'default' : 'secondary';
    };

    const getCaseTypeBadgeColor = (caseType: string) => {
        switch (caseType) {
            case 'Criminal': return 'bg-red-100 text-red-800';
            case 'Civil': return 'bg-blue-100 text-blue-800';
            case 'Decongestion': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Cases</h1>

            <SearchFilterSection
                clientNameSearch={clientNameSearch}
                setClientNameSearch={setClientNameSearch}
                caseIdSearch={caseIdSearch}
                setCaseIdSearch={setCaseIdSearch}
                stateFilter={stateFilter}
                setStateFilter={setStateFilter}
                caseTypeFilter={caseTypeFilter}
                setCaseTypeFilter={setCaseTypeFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            {/* Cases Table */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input type="checkbox" className="rounded" />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Case ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Client Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Case Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Filed By
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    State
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {casesData.map((caseItem, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleRowClick(caseItem)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            className="rounded"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {caseItem.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {caseItem.clientName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={getCaseTypeBadgeColor(caseItem.caseType)}>
                                            {caseItem.caseType}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge
                                            variant={getStatusBadgeVariant(caseItem.status)}
                                            className={caseItem.status === 'Assigned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                            {caseItem.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {caseItem.filedBy}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {caseItem.state}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Button
                                            onClick={(e) => handleAssignClick(e, caseItem)}
                                            variant={caseItem.status === 'Assigned' ? 'secondary' : 'default'}
                                            size="sm"
                                            className={caseItem.status === 'Assigned' ? 'text-gray-600 w-28' : 'bg-green-600 w-28 hover:bg-green-700' }
                                        >
                                            {caseItem.status === 'Assigned' ? 'Re-Assign' : 'Assign'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {/* <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <span className="text-sm text-gray-700">1</span>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div> */}
            </div>
            <CaseDetailsSheet
                show={showCaseDetails}
                onOpenChange={setShowCaseDetails}
                selectedCase={selectedCase}
                onAssignClick={(caseData) => {
                    setAssignmentCase(caseData);
                    setShowAssignSheet(true);
                }}
                getStatusBadgeVariant={getStatusBadgeVariant}
                getCaseTypeBadgeColor={getCaseTypeBadgeColor}
            />
            <AssignmentSheet
                open={showAssignSheet}
                onOpenChange={setShowAssignSheet}
                assignmentCase={assignmentCase}
                setShowAssignSheet={setShowAssignSheet}
                lawyers={lawyers}
                getCaseTypeBadgeColor={getCaseTypeBadgeColor}
            />
        </div>
    );
}