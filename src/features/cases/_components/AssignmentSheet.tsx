import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { ICase } from "./table-columns";
import { SubmitButton } from "@/components/submit-button";
import { AssignCaseAction } from "../server/caseAction";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GetUserByTypes } from "@/features/usersRole/userRoleAction";
import LoadingDialog from "@/components/LoadingDialog";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";
import { toast } from "sonner";
import { CLIENT_ERROR_STATUS } from "@/lib/constants";
import { useAppSelector } from "@/hooks/redux";
import { ROLES } from "@/types/auth";

const LAWYER_TYPES = ["LACON LAWYER", "PRO BONO LAWYER", "NYSC LAWYER"];

// Department and unit heads assign to lawyers and can forward to another head.
const HEAD_ROLES: string[] = [
  ROLES.CRIMINAL_JUSTICE_DEPT,
  ROLES.CIVIL_JUSTICE_DEPT,
  ROLES.DECONGESTION_UNIT_HEAD,
  ROLES.PREROGATIVE_OF_MERCY_UNIT_HEAD,
  ROLES.OSCAR_UNIT_HEAD,
  ROLES.PDSS,
  ROLES.DIO,
];
// Coordinators and zonal directors assign straight to lawyers.
const LAWYER_ONLY_ROLES: string[] = [
  ROLES.STATE_COORDINATOR,
  ROLES.CENTRE_COORDINATOR,
  ROLES.ZONAL_DIRECTOR,
];

type Assignee = {
  ID: string;
  FirstName: string;
  LastName: string;
  UserType: string;
  Status?: string;
};

interface AssignmentSheetProps {
  details: ICase | null;
  type: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function AssignmentSheet({ details, setOpen, type }: AssignmentSheetProps) {
  const [state, dispatch, isPending] = useActionState(AssignCaseAction, undefined);
  const [selectedTitle, setSelectedTitle] = useState<string | undefined>();
  const { data: user } = useAppSelector((state) => state.profile);
  const role = user?.role;
  const [dialogState, setDialogState] = useState({
    open: false,
    title: "",
    details: "",
  });

  const queryClient = useQueryClient();

  const canPickLawyers = !!role && (HEAD_ROLES.includes(role) || LAWYER_ONLY_ROLES.includes(role));
  const canPickHeads = !role || !LAWYER_ONLY_ROLES.includes(role);

  const { data: lawyersData, isLoading: lawyersLoading } = useQuery({
    queryKey: ["userByType", "lawyers"],
    queryFn: () => GetUserByTypes({ type: "lawyers" }),
    enabled: canPickLawyers,
    placeholderData: keepPreviousData,
    staleTime: 50000,
  });

  const { data: headsData, isLoading: headsLoading } = useQuery({
    queryKey: ["userByType", "unit_heads"],
    queryFn: () => GetUserByTypes({ type: "unit_heads" }),
    enabled: canPickHeads,
    placeholderData: keepPreviousData,
    staleTime: 50000,
  });

  const isActive = (u: Assignee) => !u.Status || u.Status === "ACTIVE";
  const lawyers: Assignee[] = canPickLawyers
    ? (lawyersData?.data ?? []).filter((u: Assignee) => LAWYER_TYPES.includes(u.UserType) && isActive(u))
    : [];
  const heads: Assignee[] = canPickHeads
    ? (headsData?.data ?? []).filter((u: Assignee) => u.ID !== user?.id && isActive(u))
    : [];
  const loading = (canPickLawyers && lawyersLoading) || (canPickHeads && headsLoading);
  const pickerLabel = canPickLawyers && canPickHeads
    ? "Assign to a lawyer or forward to a department"
    : canPickLawyers ? "Assign to a lawyer" : "Assign to a department";

  const handleDivisionChange = (newValue: string) => {
    setSelectedTitle(newValue === "all" ? "all" : newValue);
  };

  const dispatchAction = (formData: FormData) => {
    startTransition(() => {
      dispatch(formData);
    });
  };

  // Automatically show loading dialog when dispatching
  useEffect(() => {
    if (isPending) {
      setDialogState({
        open: true,
        title: "loading",
        details: "Assigning case...",
      });
    }
  }, [isPending]);

  // Handle success or error response
  useEffectAfterMount(() => {
    console.log(state);

    if (!state) return;

    if (CLIENT_ERROR_STATUS.includes(state.status)) {
      setDialogState({ open: false, title: "", details: "" });
      toast.error(state.message, {
        description:
          typeof state.errors === "string"
            ? state.errors
            : state.errors
              ? Object.values(state.errors).flat().join(", ")
              : undefined,
      });
    } else if (state.status === 200 || state.status === 201) {
      setDialogState({
        open: true,
        title: "done",
        details: "Case Assigned successfully!",
      });
      console.log("am here");

      queryClient.invalidateQueries({ queryKey: ["getCases"] });

      setTimeout(() => {
        setDialogState({ open: false, title: "", details: "" });
        setOpen(false);
      }, 2000);
    }
  }, [state]);

  return (
    <div className="h-screen">
      <LoadingDialog
        open={dialogState.open}
        onOpenChange={(open) =>
          setDialogState((prev) => ({ ...prev, open }))
        }
        details={dialogState.details}
        title={dialogState.title}
      />

      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900"> {(type === "Assign") ? "Assign New Case" : "Re-Assign Case"}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Case NO: {details?.id.slice(0, 10) ?? "-"}
            </p>
          </div>
        </div>

        <div className="bg-red-50 text-red-500 p-3 w-full text-xs font-medium mb-2 text-center">
          Filled: {details?.case_type ?? "-"}
        </div>

        <div className="flex justify-between gap-4">
          <div className="bg-red-50 text-red-500 p-3 w-full text-xs font-medium mb-2 text-center">
            {details?.case_type ?? "-"} Cases
          </div>
          <div className="bg-red-50 text-red-500 p-3 w-full text-xs font-medium mb-2 text-center">
            {details?.location ?? "Users"}
          </div>
        </div>
      </div>

      {/* Form */}
      <form action={dispatchAction} className="w-full space-y-6">
        <input type="hidden" name="casefile_id" value={details?.id ?? ""} />
        <input type="hidden" name="is_reassigned" value={type === "ReAssign" ? "true" : "false"} />

        <div className="pt-4">
          <Label htmlFor="assignee" className="block text-sm font-medium">
            {pickerLabel}
          </Label>
          <Select
            onValueChange={handleDivisionChange}
            value={selectedTitle}
            name="assignee_id"
          >
            <SelectTrigger
              id="assignee"
              className="h-11 flex justify-between items-center"
              disabled={loading}
              variant="underlined"
            >
              <SelectValue
                className="text-neutral-700 text-xs mx-4"
                placeholder={loading ? "Loading Users..." : "Choose assignee"}
              />
            </SelectTrigger>
            <SelectContent className="bg-white text-zinc-900">
              {lawyers.length > 0 && (
                <SelectGroup>
                  {heads.length > 0 && <SelectLabel>Lawyers</SelectLabel>}
                  {lawyers.map((u) => (
                    <SelectItem key={u.ID} value={u.ID} className="py-2">
                      {u.FirstName} {u.LastName} - {u.UserType}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
              {heads.length > 0 && (
                <SelectGroup>
                  {lawyers.length > 0 && <SelectLabel>Forward to department</SelectLabel>}
                  {heads.map((u) => (
                    <SelectItem key={u.ID} value={u.ID} className="py-2">
                      {u.FirstName} {u.LastName} - {u.UserType}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
              {lawyers.length === 0 && heads.length === 0 && (
                <div className="py-2 px-4 text-sm text-gray-500">
                  No User available
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-14">
          <SubmitButton
            value="Submit"
            pendingValue="Processing..."
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-2"
          />
        </div>
      </form>
    </div>
  );
}
