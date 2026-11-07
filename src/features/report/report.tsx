'use client';

import SheetReport from './_components/sheet_report';
import ScopeReport from './_components/ScopeReport';
import { useAppSelector } from '@/hooks/redux';
import { NATIONAL_READERS } from './readers';


export default function Report() {
    const { data: user } = useAppSelector(state => state.profile);

    return (
        <div className="flex flex-1 flex-col gap-6 pt-0 lg:mx-0">
            {NATIONAL_READERS.includes(user?.role ?? "") ? <SheetReport /> : <ScopeReport />}
        </div>
    );
};
