'use client'
import React, { useMemo, useState } from 'react';
import SearchFilterSection from './_components/SearchFilterSection';
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


export default function CasesPage() {
    const [clientNameSearch, setClientNameSearch] = useState('');
    const [caseIdSearch, setCaseIdSearch] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [caseTypeFilter, setCaseTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [caseDetails, setCaseDetails] = useState<ICase | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm] = useDebounce(clientNameSearch, 500);
    const [viewCase, setViewCase] = useState(false);
    const [viewAssignment, setViewAssignment] = useState(false);
    const { data: user } = useAppSelector((state) => state.profile);

    const { data, isLoading } = useQuery({
        queryKey: ["getCases", currentPage, caseTypeFilter, stateFilter, statusFilter],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
                search: debouncedSearchTerm,
                case_type: caseTypeFilter,
                state: stateFilter,
                status: statusFilter,
            };
            return await GetCaseAction(filters);
        },
        staleTime: 100000,
    });
    const handleOpenSheet = (user: ICase, type: "Assigned") => {
        setCaseDetails(user);
        setViewAssignment(true);
    };

    const columns = useMemo(
        () => createCaseColumns(user?.role as ROLES,
            (user) => handleOpenSheet(user, "Assigned"),),
        [user?.role]
    );

    const handleRowClick = (row: ICase) => {
        setViewCase(true);
        setCaseDetails(row);
    };

    return (
        <div className="">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Cases</h1>

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

            <CustomeSheet open={viewCase} setOpen={setViewCase} className='sm:w-[600px]'>
                <ViewCase details={caseDetails} />
            </CustomeSheet>

            <CustomeSheet open={viewAssignment} setOpen={setViewAssignment}>
                <AssignmentSheet details={caseDetails} setOpen={setViewAssignment} />
            </CustomeSheet>
        </div>
    );
}