import {  Download } from 'lucide-react';
import SheetReport from './_components/sheet_report';
import { Button } from '@/components/ui/button';

export default function Report() {
    return (
        <div className="flex flex-1 flex-col gap-6 pt-0 lg:mx-0">
           
            <SheetReport />
        </div>
    );
};



// {{baseUrl}}/export/admin-unit?unit=decongestion unit
// {{baseUrl}}/export/admin-overview
// {{baseUrl}}/export/casetypes
// {{baseUrl}}/analytics/admin-lawyer
// {{baseUrl}}/analytics/admin-demography

