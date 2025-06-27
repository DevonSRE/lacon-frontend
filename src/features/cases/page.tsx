'use client'
import React, { useMemo, useState } from 'react';
import SearchFilterSection from './_components/SearchFilterSection';
import { AssignmentSheet } from './_components/AssignmentSheet';
import { createCaseColumns, ICase } from './_components/table-columns';
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
import BulkCaseUploadDialog from '../dashboard/components/BulkUpload';
import FileACaseComponent from '../component/FileACase';

export default function CasesPage() {
    const [clientNameSearch, setClientNameSearch] = useState('');
    const [caseIdSearch, setCaseIdSearch] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [caseTypeFilter, setCaseTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [type, setType] = useState('');
    const [caseDetails, setCaseDetails] = useState<ICase | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm] = useDebounce(clientNameSearch, 500);
    const [viewCase, setViewCase] = useState(false);
    const [viewAssignment, setViewAssignment] = useState(false);
    const { data: user } = useAppSelector((state) => state.profile);
    const role = user?.role;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["getCases", currentPage, caseTypeFilter, stateFilter, statusFilter],
        queryFn: async () => {
            const filters = {
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
                search: debouncedSearchTerm,
                case_type: (caseTypeFilter) ? caseTypeFilter : "",
                state: (stateFilter === "all") ? "" : stateFilter,
                status: (statusFilter === "all") ? "" : statusFilter,
            };
            return await GetCaseAction(filters);
        },
        staleTime: 100000,
    });

    const handleOpenSheet = (user: ICase, type: "Assign" | "ReAssign" | "Review" | "viewCase" | "suspend") => {
        setCaseDetails(user);
        setType(type);
        if (type == "viewCase") {
            setViewCase(true);
        }
        if (type === "Assign" || type === "ReAssign") {
            setViewAssignment(true);
        }
    };

    const handleCaseSubmitted = () => {
        // Refetch cases data when a new case is submitted
        refetch();
    };

    const columns = useMemo(
        () => createCaseColumns(user?.role as ROLES,
            (user) => handleOpenSheet(user, "Assign"),
            (user) => handleOpenSheet(user, "ReAssign"),
            (user) => handleOpenSheet(user, "Review"),
            (user) => handleOpenSheet(user, "viewCase"),
            (user) => handleOpenSheet(user, "suspend"),
        ),
        [user?.role]
    );

    return (
        <div className="">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Cases</h1>
                <div className="flex gap-4">
                    {(role === ROLES.OSCAR_UNIT_HEAD || role === ROLES.PARALEGAL || role === ROLES.DECONGESTION_UNIT_HEAD || role === ROLES.PDSS || role === ROLES.PREROGATIVE_OF_MERCY_UNIT_HEAD) && (
                        <>
                            <BulkCaseUploadDialog />
                            <FileACaseComponent
                                userRole={role as ROLES}
                                showIcon={true}
                                buttonText="File a Case"
                                buttonClassName="bg-red-600 hover:bg-red-700 text-white px-4 py-2  flex items-center gap-2 transition-colors h-11"
                                onCaseSubmitted={handleCaseSubmitted}
                            />
                        </>
                    )}
                </div>
            </div>

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
            <DataTable columns={columns} loading={isLoading} data={data?.data.data}/>
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
                <ViewCase details={caseDetails}  />
            </CustomeSheet>

            <CustomeSheet open={viewAssignment} setOpen={setViewAssignment}>
                <AssignmentSheet details={caseDetails} setOpen={setViewAssignment} type={type} />
            </CustomeSheet>
        </div>
    );
}
