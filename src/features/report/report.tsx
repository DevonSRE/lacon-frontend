'use client';

import SheetReport from './_components/sheet_report';
import ScopeReport from './_components/ScopeReport';
import { useAppSelector } from '@/hooks/redux';
import { ROLES } from '@/types/auth';

// Who the admin report is for. It reads /analytics/admin-*, which the API opens
// only to these three; everyone else allowed on this page reads the role-scoped
// report instead (QA 2026-11-01, item 25).
const NATIONAL_READERS: string[] = [ROLES.ADMIN, ROLES.PLATFORM_ADMIN, ROLES.DIRECTOR_GENERAL];

export default function Report() {
    const { data: user } = useAppSelector(state => state.profile);

    return (
        <div className="flex flex-1 flex-col gap-6 pt-0 lg:mx-0">
            {NATIONAL_READERS.includes(user?.role ?? "") ? <SheetReport /> : <ScopeReport />}
        </div>
    );
};
