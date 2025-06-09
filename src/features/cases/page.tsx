'use client'
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SearchFilterSection from './_components/SearchFilterSection';
import CaseDetailsSheet from './_components/CaseDetailsSheet';
import { TCase } from '@/lib/types';
import { AssignmentSheet } from './_components/AssignmentSheet';
import { createUserColumns, getCaseTypeBadgeColor, getStatusBadgeVariant } from './_components/table-columns';
import { DataTable } from '@/components/data-table';
import TablePagination from '@/components/TablePagination';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { useDebounce } from 'use-debounce';
import { GetCaseAction } from './server/caseAction';
import { useAppSelector } from '@/hooks/redux';

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

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const { data: user } = useAppSelector((state) => state.profile);


    const { data, isLoading } = useQuery({
        queryKey: ["getCases", currentPage, debouncedSearchTerm],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
                query: debouncedSearchTerm,
            };
            return await GetCaseAction(filters);
        },
        staleTime: 100000,
    });

    const columns = useMemo(
        () => createUserColumns(user?.role!, "all"),
        [user?.role]
    );

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
            <DataTable columns={columns} loading={isLoading} data={data?.data.data} />
            {data?.data?.data?.length > 0 && (
                <div className="flex justify-end pt-4">
                    <TablePagination
                        currentPage={currentPage}
                        totalCount={data?.data.total_rows}
                        pageSize={DEFAULT_PAGE_SIZE}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}


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