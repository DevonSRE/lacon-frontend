'use client'
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ProbonoUpdate from "./components/ProbonoUpdate";


export default function ProbonoUpdatePage() {
  const router = useRouter();
  return (
    <div className="min-w-6xl mx-auto p-10 space-y-8 mb-20 pb-10 ">
      <Button variant={"ghost"} className="bg-white rounded-full "
        onClick={() => router.back()}>
        <ArrowLeft className="h-5 text-black w-5" />
      </Button>
      <ProbonoUpdate />
    </div>
  );
}   