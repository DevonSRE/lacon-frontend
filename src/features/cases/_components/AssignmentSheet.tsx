import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useRef,
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

interface AssignmentSheetProps {
  details: ICase | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function AssignmentSheet({ details, setOpen }: AssignmentSheetProps) {
  const [state, dispatch, isPending] = useActionState(AssignCaseAction, undefined);
  const [selectedTitle, setSelectedTitle] = useState<string | undefined>();
  const [dialogState, setDialogState] = useState({
    open: false,
    title: "",
    details: "",
  });

  const queryClient = useQueryClient();

  const { data, isLoading: loading } = useQuery({
    queryKey: ["userByType"],
    queryFn: async () => {
      const filters = { type: "unit_heads" };
      return await GetUserByTypes(filters);
    },
    placeholderData: keepPreviousData,
    staleTime: 50000,
  });

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
            <h1 className="text-xl font-bold text-gray-900">Assign New Case</h1>
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
        <input type="hidden" name="is_reassigned" value="true" />

        <div className="pt-4">
          <Label htmlFor="department" className="block text-sm font-medium">
            Select Department
          </Label>
          <Select
            onValueChange={handleDivisionChange}
            value={selectedTitle}
            name="assignee_id"
          >
            <SelectTrigger
              className="h-11 flex justify-between items-center"
              disabled={loading}
              variant="underlined"
            >
              <SelectValue
                className="text-neutral-700 text-xs mx-4"
                placeholder={loading ? "Loading Users..." : "Choose Department to Assign case"}
              />
            </SelectTrigger>
            <SelectContent className="bg-white text-zinc-900">
              {data?.data?.length > 0 ? (
                data?.data.map((user: any) => (
                  <SelectItem key={user.ID} value={user.ID} className="py-2">
                    {user.FirstName} {user.LastName} - {user.UserType}
                  </SelectItem>
                ))
              ) : (
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
