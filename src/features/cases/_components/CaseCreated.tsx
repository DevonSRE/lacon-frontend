"use client";

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/icons/icons";
import { CustomeSheet } from "@/components/CustomSheet";
import ViewCase from "./viewCase";
import { ICase } from "./table-columns";


type CustomeSheetProps = {
    setOpen: Dispatch<SetStateAction<boolean>>;
    openFileACase: Dispatch<SetStateAction<boolean>>;
    details: { details: ICase | null }
};


export default function CaseCreated({ setOpen, openFileACase }: CustomeSheetProps) {
    const router = useRouter();
    const [viewCase, setViewCase] = useState(false);
    const [caseDetails, setCaseDetails] = useState<ICase | null>(null);

    const handleViewCase = () => {
        setViewCase(true);
        setOpen(false);
    };

    const handleFileAnother = () => {
        setOpen(false);
        openFileACase(true);
    };

    const handleReturnDashboard = () => {
        setOpen(false);
        router.push("/dashboard");
    };

    const today = new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="mt-10">
            <div className="flex flex-col items-center space-y-10">
                <Icons.SUCCESSCHECK className="w-50 h-50 text-green-500 animate-ping-slow" />
                <div className="flex space-y-2 flex-col items-center">
                    <h1 className="text-xl font-semibold">Created Successfully</h1>
                    <p className="text-gray-600">Your case has been successfully filed</p>
                    <p className="text-green-600 font-medium">{`Today, ${today}`}</p>
                </div>
                <div className="flex flex-col w-full  space-y-4 mt-6">
                    <Button
                        onClick={handleViewCase}
                        variant={"outline"}
                        className="border border-black w-full py-2 rounded text-black hover:bg-black hover:text-white transition h-14"
                    >
                        View This Case
                    </Button>
                    <Button
                        onClick={handleFileAnother}
                        className="bg-black text-white py-2 rounded hover:bg-gray-800 transition h-14">
                        File Another Case
                    </Button>
                    <Button
                        onClick={handleReturnDashboard}
                        className="bg-red-600 text-white py-2 rounded hover:bg-red-700 transition h-14"
                    >
                        Return to Dashboard
                    </Button>
                </div>
            </div>
            <CustomeSheet open={viewCase} setOpen={setViewCase} className='sm:w-[600px]'>
                <ViewCase details={caseDetails} />
            </CustomeSheet>
        </div>
    );
}
