import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
    const dialogCloseRef = useRef<HTMLButtonElement>(null);
    const { isOpen, setIsOpen, setSeletedStateId } = useAction();

    const [selectedState, setSelectedState] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [caseType, setCaseType] = useState<"Civil" | "Criminal" | "PDSS-InStation" | "PDSS-Organisation" | "">("");

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
        setLoading(true);

        if (dialogCloseRef.current) {
            dialogCloseRef.current.click();
        }

        setTimeout(() => {
            setLoading(false);
            const slug = caseType.trim().toLowerCase().replace(/\s+/g, "-");
            router.push(`/probuno/cases/${slug}`);
        }, 100);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-xl">
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
                                onLoadingChange={(loading) => setLoading(loading)}
                            />
                        </div>

                        <div className="space-y-6">
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
                                        {/* <SelectItem value="PDSS-InStation">PDSS (In Station)</SelectItem> */}
                                        <SelectItem value="PDSS-Organisation">PDSS (Organisation)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </DialogDescription>
                <DialogFooter className="flex flex-col gap-2">
                    <DialogClose asChild>
                        <button ref={dialogCloseRef} className="hidden" />
                    </DialogClose>
                    <Button
                        disabled={loading}
                        className="w-full h-11 bg-red-500"
                        onClick={handleProceed}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? "Proceeding" : "Proceed"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
