'use client'
import { Button } from "@/components/ui/button";
import ProBonoForm from "../dashboard/Lawyer/_components/OnlineProLawyerReg";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProbonoRegisteratonPage() {
    const router = useRouter();
    return (
        <div className="max-w-6xl  mx-auto p-10 space-y-8 mb-20 pb-10 ">
            <Button variant={"ghost"} className="bg-white rounded-full "
                onClick={() => router.back()}>
                <ArrowLeft className="h-5 text-black w-5" />
            </Button>
            <ProBonoForm isPublic={true} />
        </div>
    );
}