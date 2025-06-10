'use client'
import React, { useMemo, useState } from 'react';
import SearchFilterSection from './_components/SearchFilterSection';
import CaseDetailsSheet from './_components/CaseDetailsSheet';
import { TCase } from '@/lib/types';
import { AssignmentSheet } from './_components/AssignmentSheet';
import { createCaseColumns, getCaseTypeBadgeColor, getStatusBadgeVariant, ICase } from './_components/table-columns';
import { DataTable } from '@/components/data-table';
import TablePagination from '@/components/TablePagination';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { useDebounce } from 'use-debounce';
import { GetCaseAction } from './server/caseAction';
import { useAppSelector } from '@/hooks/redux';
import { CustomeSheet } from '@/components/CustomSheet';
import ViewCase from './_components/viewCase';
import { ROLES } from '@/types/auth';

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
    const [caseDetails, setCaseDetails] = useState<ICase | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const { data: user } = useAppSelector((state) => state.profile);

    const [viewCase, setViewCase] = useState(false);
    const [viewAssignment, setViewAssignment] = useState(false);
    const [assignmentSheet, setAssignmentSheet] = useState<ICase | null>(null);


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
    console.log(user?.role);
    // const columns = useMemo(
    //     () => createCaseColumns(user?.role!, "all"),
    //     [user?.role]
    // );

    const handleOpenSheet = (user: ICase, type: "Assigned") => {
        setAssignmentSheet(user);
        setViewAssignment(true);
    };

    const columns = useMemo(
        () =>
            createCaseColumns(user?.role as ROLES,
                (user) => handleOpenSheet(user, "Assigned"),
            ),
        [user?.role]
    );


    const handleRowClick = (row: ICase) => {
        setViewCase(true);
        setCaseDetails(row);
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
            <DataTable onRowClick={handleRowClick} columns={columns} loading={isLoading} data={data?.data.data} />
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

            <CustomeSheet open={viewCase} setOpen={setViewCase}>
                <ViewCase details={caseDetails} />
            </CustomeSheet>
            
            <CustomeSheet open={viewAssignment} setOpen={setViewAssignment}>
                <AssignmentSheet details={assignmentSheet} />
            </CustomeSheet>

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
            {/* <AssignmentSheet
                open={showAssignSheet}
                onOpenChange={setShowAssignSheet}
                assignmentCase={assignmentSheet}
                setShowAssignSheet={setAssignmentSheet}
                lawyers={lawyers}
                getCaseTypeBadgeColor={getCaseTypeBadgeColor}
            /> */}
        </div>
    );
}