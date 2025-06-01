import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TCase } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type CaseType = "Criminal" | "Civil" | "Decongestion";



interface AssignmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentCase: TCase | null;
  lawyers: string[];
  setShowAssignSheet: (open: boolean) => void;
  getCaseTypeBadgeColor: (caseType: CaseType) => string;
}

export const AssignmentSheet = ({
  open,
  onOpenChange,
  assignmentCase,
  lawyers,
  setShowAssignSheet,
  getCaseTypeBadgeColor,
}: AssignmentSheetProps) => {
  // const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState("");
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[480px] flex flex-col gap-6 p-6">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-left p-0 text-sm"
          >
            ←
          </Button>
          <h2 className="text-lg font-semibold">Assign New case</h2>
          <p className="text-sm text-gray-500">Case No: #LCN 001</p>
        </div>

        <div className="relative">
          <Input placeholder="Search........" className="pr-10" />
        </div>

        <div className="space-y-2">
          <p className="text-red-500 text-sm font-medium">
            Filled: 08/04/25 by 8:30am
          </p>
          <div className="flex gap-2">
            <Badge variant="secondary">Criminal Case</Badge>
            <Badge variant="secondary">Lagos</Badge>
          </div>
        </div>

        <div className="pt-4">
          <Label htmlFor="department" className="block text-sm font-medium">
            Select Department
          </Label>
          <Select onValueChange={setDepartment}>
            <SelectTrigger id="department">
              <SelectValue placeholder="Choose Department to Assign case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="criminal">Criminal Justice Department Head</SelectItem>
              <SelectItem value="civil">Civil Justice Department Head</SelectItem>
              <SelectItem value="decongestion">Decongestion Unit Head</SelectItem>
              <SelectItem value="prerogative">Prerogative of Mercy Unit Head</SelectItem>
              <SelectItem value="oscar">OSCAR Unit Head</SelectItem>
              <SelectItem value="dio">DIO</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-auto">
          <Button className="w-full">Next →</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
