import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { TCase } from "@/lib/types";

type Props = {
    show: boolean;
    onOpenChange: (value: boolean) => void;
    selectedCase: TCase | null;
    onAssignClick: (caseData: TCase) => void;
    getStatusBadgeVariant: (status: string) => "default" | "secondary" | "destructive" | "outline" | null | undefined;
    getCaseTypeBadgeColor: (caseType: string) => string;
};

const CaseDetailsSheet: React.FC<Props> = ({
    show,
    onOpenChange,
    selectedCase,
    onAssignClick,
    getStatusBadgeVariant,
    getCaseTypeBadgeColor,
}) => {
    return (
        <Sheet open={show} onOpenChange={onOpenChange}>
            <SheetContent className="h-min">
                <div className="space-y-10 p-6 mt-10">
                    <div>
                        <h1 className="text-xl font-bold">CASE ID: LCN-cr-0098726</h1>
                        <p className="text-sm text-muted-foreground">Filed On April 6th, 2025</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Badge className="p-3 w-full bg-[#CC0B0B0D] text-red-500">
                            Criminal Case
                        </Badge>
                        <Badge variant="destructive" className=" p-3 w-full bg-[#CC0B0B0D] text-red-500">
                            Lagos
                        </Badge>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold mb-2">Client Information</h2>
                        <div className="space-y-2">
                            <div className="text-xs grid grid-cols-2 gap-4">
                                <div className=" text-muted-foreground">Name:</div>
                                <div className="justify-start ">Jonathan divotter</div>
                            </div>
                            <div className="text-xs grid grid-cols-2 gap-4">
                                <div className=" text-muted-foreground">Number:</div>
                                <div className="justify-start ">08000000000</div>
                            </div>
                            <div className="text-xs grid grid-cols-2 gap-4">
                                <div className=" text-muted-foreground">Remanded:</div>
                                <div className="justify-start ">November 6th, 2025</div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h2 className="text-sm font-semibold mb-2">Case Description</h2>
                        <p className="text-sm">
                            Client alleges wrongfully remanded for over 3 years. requesting legal aid representation.
                            Claims Offence was minor and bail never granted.
                        </p>
                    </div>

                    <Separator />

                    <div>
                        <h2 className="text-sm font-semibold mb-2">Case Intake Officer</h2>
                        <div className="space-y-2">
                            <div className="text-xs grid grid-cols-2 gap-4">
                                <p className="text-sm text-muted-foreground">Name:</p>
                                <p>Jonathan Potter</p>
                            </div>
                            <div className="text-xs grid grid-cols-2 gap-4">
                                <p className="text-sm text-muted-foreground">Intake Date:</p>
                                <p>November 6th, 2025</p>
                            </div>
                            <div className="text-xs grid grid-cols-2 gap-4">
                                <p className="text-sm text-muted-foreground">Intake Channel:</p>
                                <p>Walk-In</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button className="bg-primary w-full h-11 text-xs hover:bg-primary/90">
                            Assign Case
                        </Button>
                    </div>
                </div>
                {/* <SheetHeader>
                    <SheetTitle>Case Details</SheetTitle>
                    <SheetDescription>
                        View detailed information about this case
                    </SheetDescription>
                </SheetHeader>

                {selectedCase && (
                    <div className="mt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Case ID</Label>
                                <p className="text-sm font-semibold text-gray-900 mt-1">{selectedCase.id}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Status</Label>
                                <Badge
                                    variant={getStatusBadgeVariant(selectedCase.status)}
                                    className={`mt-1 ${selectedCase.status === "Assigned"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    {selectedCase.status}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-500">Client Name</Label>
                            <p className="text-sm text-gray-900 mt-1">{selectedCase.clientName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Case Type</Label>
                                <Badge className={`mt-1 ${getCaseTypeBadgeColor(selectedCase.caseType)}`}>
                                    {selectedCase.caseType}
                                </Badge>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">State</Label>
                                <p className="text-sm text-gray-900 mt-1">{selectedCase.state}</p>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-500">Filed By</Label>
                            <p className="text-sm text-gray-900 mt-1">{selectedCase.filedBy}</p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-500">Case Description</Label>
                            <p className="text-sm text-gray-900 mt-1">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-500">Date Filed</Label>
                            <p className="text-sm text-gray-900 mt-1">March 15, 2024</p>
                        </div>

                        {selectedCase.status === "Assigned" && (
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Assigned Lawyer</Label>
                                <p className="text-sm text-gray-900 mt-1">John Adebayo</p>
                            </div>
                        )}

                        <div className="pt-4">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAssignClick(selectedCase);
                                    onOpenChange(false);
                                }}
                                className="w-full"
                                variant={selectedCase.status === "Assigned" ? "outline" : "default"}
                            >
                                {selectedCase.status === "Assigned" ? "Re-assign Case" : "Assign Case"}
                            </Button>
                        </div>
                    </div>
                )} */}
            </SheetContent>
        </Sheet>
    );
};

export default CaseDetailsSheet;
