import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GetState } from "@/components/get-state";
import { useRouter } from "next/navigation";

import { useRef } from "react";
export default function FileACase() {
    const router = useRouter();
    const dialogCloseRef = useRef<HTMLButtonElement>(null);

    const [step, setStep] = useState<1 | 2>(1);
    const [selectedState, setSelectedState] = useState<string>("");
    const [caseType, setCaseType] = useState<"Civil" | "Criminal" | "PDSS-InStation" | "PDSS-Organisation" | "">("");

    const handleProceed = () => {
        if (!caseType) return;

        // Close dialog first
        if (dialogCloseRef.current) {
            dialogCloseRef.current.click();
        }

        // Delay navigation slightly to allow dialog to close
        setTimeout(() => {
            const slug = caseType.trim().toLowerCase().replace(/\s+/g, "-");
            router.push(`probuno/cases/${slug}`);
        }, 100); // Small delay (100ms)
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="border-2">
                    <PlusCircle className="w-4 h-4" />
                    File a Case
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl">
                <DialogHeader className="space-y-4">
                    {step === 1 && <DialogTitle>Select Filing Location</DialogTitle>}
                    {step === 2 && <DialogTitle>Select Case Type</DialogTitle>}
                </DialogHeader>

                <DialogDescription>
                    {step === 1 && (
                        <div className="space-y-6">
                            <Label htmlFor="state-select">Where are you filing from?</Label>
                            <GetState
                                value={selectedState}
                                onValueChange={(val: string) => setSelectedState(val)}
                                placeholder="Select your state"
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 my-8">
                            <Label htmlFor="case-type-select">What type of case are you filing?</Label>
                            <Select 
                                value={caseType}
                                onValueChange={(val) => setCaseType(val as any)}
                            >
                                <SelectTrigger className="w-full h-11">
                                    <SelectValue placeholder="Choose a case type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Case Type</SelectLabel>
                                        <SelectItem value="Civil">Civil</SelectItem>
                                        <SelectItem value="Criminal">Criminal</SelectItem>
                                        <SelectItem value="PDSS-InStation">PDSS (In Station)</SelectItem>
                                        <SelectItem value="PDSS-Organisation">PDSS (Organisation)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </DialogDescription>

                <DialogFooter className="flex flex-col gap-2">
                    {step === 1 && (
                        <Button
                            className="w-full h-11 bg-red-500"
                            onClick={() => {
                                if (selectedState) setStep(2);
                            }}
                        >
                            Save &amp; Continue
                        </Button>
                    )}

                    {step === 2 && (
                        <>
                            <DialogClose asChild>
                                <button ref={dialogCloseRef} className="hidden" />
                            </DialogClose>

                            <Button className="w-full h-11 bg-red-500" onClick={handleProceed}>
                                Proceed
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
