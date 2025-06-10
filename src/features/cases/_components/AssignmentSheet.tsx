
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActionState, useState } from "react";
import { ICase } from "./table-columns";
import { SubmitButton } from "@/components/submit-button";
import { AssignCaseAction } from "../server/caseAction";



export const AssignmentSheet = (details: { details: ICase | null }) => {
  const [state, dispatch, isPending] = useActionState(AssignCaseAction, undefined);

  // const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState("");
  return (
    <div className="h-screen">
      {/* Header Section */}
      <div className="border-b  border-gray-200 pb-4 mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Assign New Case
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Case NO:  {details.details?.filed_date ?? "-"}
            </p>
          </div>
        </div>
        <div className=" bg-red-50 text-red-500 p-3 w-full  text-sm font-medium mb-2 text-center items-center">
          Filled:   {details.details?.case_type ?? "-"}
        </div>
        <div className="flex justify-between gap-4">
          <div className=" bg-red-50 text-red-500 p-3 w-full  text-sm font-medium mb-2 text-center items-center">
            {details.details?.case_type ?? "-"} Cases
          </div>
          <div className=" bg-red-50 text-red-500 p-3 w-full  text-sm font-medium mb-2 text-center items-center">
            {details.details?.location ?? "state"}
          </div>
        </div>
      </div>

      <form action={dispatch} className="w-full space-y-6">
         <input type="hidden" name="casefile_id" value={details.details?.id ?? ""} />
        <div className="pt-4">
          <Label htmlFor="department" className="block text-sm font-medium">
            Select Department
          </Label>
          <Select onValueChange={setDepartment} name="assigned_to" >
            <SelectTrigger id="department" className="h-11">
              <SelectValue placeholder="Choose Department to Assign case" />
            </SelectTrigger>
            <SelectContent className="rounde-xs">
              <SelectItem value="criminal">Criminal Justice Department Head</SelectItem>
              <SelectItem value="civil">Civil Justice Department Head</SelectItem>
              <SelectItem value="decongestion">Decongestion Unit Head</SelectItem>
              <SelectItem value="prerogative">Prerogative of Mercy Unit Head</SelectItem>
              <SelectItem value="oscar">OSCAR Unit Head</SelectItem>
              <SelectItem value="dio">DIO</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-14">
          <SubmitButton
            value="Submit"
            // loading={isPending}
            pendingValue="Processing..."
            className="w-full  bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-2"
          />

        </div>
      </form>

    </div>
  );
};
