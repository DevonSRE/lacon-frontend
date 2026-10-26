import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { useAction } from "@/context/ActionContext";
import { toast } from "sonner";

export default function FileACase() {
    const router = useRouter();
    const { isOpen, setIsOpen, setSeletedStateId } = useAction();

    const [selectedState, setSelectedState] = useState<string>("");
    const [statesLoading, setStatesLoading] = useState<boolean>(false);
    const [isNavigating, startNavigation] = useTransition();
    const [caseType, setCaseType] = useState<"Civil" | "Criminal" | "PDSS-InStation" | "PDSS-Organisation" | "">("");

    const resetSelections = () => {
        setSelectedState("");
        setCaseType("");
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) resetSelections();
    };

    const handleProceed = () => {
        if (!selectedState) {
            toast.error("Please select a state");
            return;
        }

        if (!caseType) {
            toast.error("Please select case type");
            return;
        }

        setSeletedStateId(selectedState);
        const slug = caseType.trim().toLowerCase().replace(/\s+/g, "-");
        resetSelections();
        startNavigation(() => {
            setIsOpen(false);
            router.push(`/probono/cases/${slug}`);
        });
    };

    return (
        <>
        {isNavigating && (
            <div role="status" aria-live="polite" className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-3 rounded-lg border bg-white px-5 py-4 shadow-lg">
                    <Loader2 className="size-5 animate-spin text-red-600" />
                    <span className="text-sm font-medium text-gray-800">Loading case form…</span>
                </div>
            </div>
        )}
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogClose asChild>
                    <button
                        type="button"
                        aria-label="Close file a case dialog"
                        className="absolute right-4 top-4 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <X className="size-4" />
                    </button>
                </DialogClose>
                <DialogHeader className="space-y-4">
                    <DialogTitle>File a Case</DialogTitle>
                </DialogHeader>

                <DialogDescription asChild>
                    <div className="space-y-6 my-4">
                        <div className="space-y-6">
                            <Label htmlFor="state-select">Where are you filing from?</Label>
                            <GetState
                                value={selectedState}
                                onValueChange={(val: string) => setSelectedState(val)}
                                placeholder="Select your state"
                                onLoadingChange={(loading) => setStatesLoading(loading)}
                            />
                        </div>

                        <div className="space-y-6">
                            <Label htmlFor="case-type-select">What type of case are you filing?</Label>
                            <Select
                                value={caseType}
                                onValueChange={(val) => setCaseType(val as typeof caseType)}
                            >
                                <SelectTrigger className="w-full h-11">
                                    <SelectValue placeholder="Choose a case type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Case Type</SelectLabel>
                                        <SelectItem value="Civil">Civil</SelectItem>
                                        <SelectItem value="Criminal">Criminal</SelectItem>
                                        {/* <SelectItem value="PDSS-InStation">PDSS (In Station)</SelectItem> */}
                                        <SelectItem value="PDSS-Organisation">PDSS (Organisation)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </DialogDescription>
                <DialogFooter className="flex flex-col gap-2">
                    <Button
                        disabled={statesLoading || isNavigating || !selectedState || !caseType}
                        className="w-full h-11 bg-red-500"
                        onClick={handleProceed}
                    >
                        {(statesLoading || isNavigating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {statesLoading ? "Loading states…" : isNavigating ? "Proceeding…" : "Proceed"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
