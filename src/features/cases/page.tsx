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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ROLES } from '@/types/auth';
import BulkCaseUploadDialog from '../dashboard/components/BulkUpload';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CivilCaseForm from './FileCasesTab/CivilCaseForm';
import CriminalCaseForm from './FileCasesTab/CriminalCaseForm';
import PDSSCaseForm from './FileCasesTab/PSDDCaseForm';
import DecongestionForm from './FileCasesTab/DecongestionForm';
import MercyApplication from './FileCasesTab/MercyApplication';


export default function CasesPage() {
    const [clientNameSearch, setClientNameSearch] = useState('');
    const [caseIdSearch, setCaseIdSearch] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [caseTypeFilter, setCaseTypeFilter] = useState('');
    const [selectedCaseForm, setCaseForm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [caseDetails, setCaseDetails] = useState<ICase | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm] = useDebounce(clientNameSearch, 500);
    const [viewCase, setViewCase] = useState(false);
    const [viewAssignment, setViewAssignment] = useState(false);
    const [openFileACase, setOpenFileACase] = useState(false);
    const [openCaseType, setCaseType] = useState(false);
    const { data: user } = useAppSelector((state) => state.profile);
    const role = user?.role;

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
    const handleCaseTypez = () => {
        console.log(caseTypeFilter);
        setCaseType(true);
    }

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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Cases</h1>
                <div className="flex gap-4">
                    {(role === ROLES.OSCAR_UNIT_HEAD || role === ROLES.PARALEGAL || role === ROLES.DECONGESTION_UNIT_HEAD || role === ROLES.PDSS) && (
                        <>
                            <BulkCaseUploadDialog />
                            <Button onClick={() => setOpenFileACase(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2  flex items-center gap-2 transition-colors h-11">
                                <PlusCircle className="w-4 h-4" />
                                File a Case
                            </Button>
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


            {/* Add a Lawyer Component shee */}
            <CustomeSheet open={openFileACase} setOpen={setOpenFileACase} >
                <div className="mt-6 space-y-6">
                    <h1 className="text-xl font-semibold">File A Case</h1>
                    <Select value={selectedCaseForm} onValueChange={setCaseForm}>
                        <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Case Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {(role === ROLES.OSCAR_UNIT_HEAD || role === ROLES.PARALEGAL) && (
                                <>
                                    <SelectItem value="Civil">Civil</SelectItem>
                                    <SelectItem value="Criminal">Criminal</SelectItem>
                                    <SelectItem value="PDSS1">PDSS(In Station)</SelectItem>
                                    <SelectItem value="PDSS2">PDSS(In Organanization)</SelectItem>
                                </>
                            )}
                            {(role === ROLES.DECONGESTION_UNIT_HEAD) && (
                                <SelectItem value="Decongestion">Decongestion</SelectItem>
                            )}
                            {(role === ROLES.PREROGATIVE_OF_MERCY_UNIT_HEAD) && (
                                <SelectItem value="MercyApplication">Mercy Application</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={handleCaseTypez}
                        disabled={!selectedCaseForm}
                        className={`w-full bg-red-500 h-11 ${selectedCaseForm ? 'bg-red-600 hover:bg-red-700' : ''}`}>
                        Proceed
                    </Button>
                </div>
            </CustomeSheet>

            <CustomeSheet open={openCaseType} setOpen={setCaseType} className="min-w-3xl " >
                <div className="mt-6 overflow-auto">
                    {selectedCaseForm === "Civil" && <CivilCaseForm />}
                    {selectedCaseForm === "Criminal" && <CriminalCaseForm />}
                    {selectedCaseForm === "PDSS1" && <PDSSCaseForm />}
                    {selectedCaseForm === "PDSS2" && <PDSSCaseForm />}
                    {selectedCaseForm === "Decongestion" && <DecongestionForm />}
                    {selectedCaseForm === "MercyApplication" && <MercyApplication />}
                </div>
            </CustomeSheet>
        </div>
    );
}