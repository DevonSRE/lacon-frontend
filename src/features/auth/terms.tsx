"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";

const TermsAndPrivacy: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === "/login";

  const handlePreviousStep = () => {
    router.back();
  };

  return (
    <div className="sticky container bg-white shadow-lg border-t-2 px-2 bottom-0 w-full z-50">
      <CardFooter className={`flex h-20 py-0 items-center ${isActive ? 'justify-center w-full' : 'justify-between'}`}>
        {!isActive && (
          <div className="w-full">
            <Button
              variant="outline"
              className="font-semibold  border-2 uppercase border-primary text-xs text-neutral-600 h-11"
              onClick={handlePreviousStep}
            >
              <MoveLeft className="mr-2" /> Back
            </Button>
          </div>
        )}
        <div
          className={`text-xs flex w-full items-center gap-2 text-gray-400 ${isActive ? 'justify-center flex-1' : 'justify-start'}`}
        >
          <span>TERMS OF USE</span>
          <span>|</span>
          <span>PRIVACY POLICY</span>
        </div>
      </CardFooter>
    </div>
  );
};

export default TermsAndPrivacy;
