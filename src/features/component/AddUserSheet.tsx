

"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAction } from "@/context/ActionContext";
import { InviteUser } from "../dashboard/server/action";
import { SubmitButton } from "@/components/submit-button";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";
import InputField from "@/components/form/input/InputField";
import { isFieldErrorObject } from "@/types/auth";
import { FormDataUser } from "../dashboard/server/type";
import { CustomeSheet } from "@/components/CustomSheet";
import LoadingDialog from "@/components/LoadingDialog";
import { useQueryClient } from "@tanstack/react-query";
import { GetZone } from "@/components/get-zone";
import { GetState } from "@/components/get-state";
import { GetInActiveUser } from "@/components/get-inactive-users";
import { GetInvitationCenter } from "@/components/get-invitation-center";
import { invitationScope } from "@/lib/user-invitation-options";

import { submitWithoutReset } from "@/lib/submit-without-reset";
const defaultFormData: FormDataUser = {
  user_type: "",
  designation: "",
  state_id: "",
  center_id: "",
  zone_id: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
};

export function AddUserSheet() {
  const { isOpen, setIsOpen, openLoadingDialog, setLoadingDialog } =
    useAction();
  const [state, dispatch, isPending] = useActionState(InviteUser, undefined);
  const [formData, setFormData] = useState<FormDataUser>(defaultFormData);
  const [submittedRole, setSubmittedRole] = useState("");
  const queryClient = useQueryClient();
  const scope = invitationScope(formData.user_type, formData.designation);
  const handleChange = (key: keyof FormDataUser, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  useEffectAfterMount(() => {
    if (state && state.status >= 400) {
      toast.error(state?.message, {
        description:
          typeof state?.errors === "string"
            ? state.errors
            : state?.errors
            ? Object.values(state.errors).flat().join(", ")
            : undefined,
      });
      setTimeout(() => {
        setLoadingDialog({ open: false, title: "", details: "" });
      }, 500);
    } else if (state?.status === 200 || state?.status === 201) {
      toast.success("User invited successfully!");
      setIsOpen(false);
      setFormData(defaultFormData);
      setLoadingDialog({
        open: true,
        title: "done",
        details: "User Created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      queryClient.invalidateQueries({ queryKey: ["InActiveUsers"] });
      setTimeout(() => {
        setLoadingDialog({ open: false, title: "", details: "" });
      }, 2000);
    }
  }, [state]);
  const serverErrors = isFieldErrorObject(state?.errors) ? state.errors : {};
  const dispatchAction = (formData: FormData) => {
    setSubmittedRole(String(formData.get("user_type") ?? ""));
    startTransition(() => {
      dispatch(formData);
    });
  };
  useEffect(() => {
    if (isPending) {
      setLoadingDialog({
        open: true,
        title: "loading",
        details: "Creating User Role...",
      });
    }
  }, [isPending, setLoadingDialog]);

  return (
    <>
      <LoadingDialog
        open={openLoadingDialog.open}
        onOpenChange={(open) => setLoadingDialog((prev) => ({ ...prev, open }))}
        details={openLoadingDialog.details}
        title={openLoadingDialog.title}
      />
      <CustomeSheet open={isOpen} setOpen={setIsOpen} className="sm:w-[600px]">
        <form className="space-y-6" onSubmit={submitWithoutReset(dispatchAction)}>
          <h2 className="text-xl font-semibold">Add New User</h2>
          {!isPending && state && state.status >= 400 && submittedRole === formData.user_type && <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <p>{state.message}</p>
            {state.errors && <p>{typeof state.errors === "string" ? state.errors : Object.values(state.errors).flat().join(". ")}</p>}
          </div>}
          <div className="space-y-1">
            <Label>User Role</Label>
            <GetInActiveUser
              value={formData.user_type}
              onValueChange={(val: string) => {
                setFormData(prev => ({ ...prev, user_type: val, designation: "", state_id: "", zone_id: "", center_id: "" }));
              }}
              placeholder="Select User Type"
            />
          </div>

          {formData.user_type !== "" && (
            <>
              {(formData.user_type === "LACON LAWYER" ||
                formData.user_type === "PRO BONO LAWYER") && (
                <div className="space-y-1">
                  <Label>
                    Designation <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    key={formData.designation + state?.status}
                    name="designation"
                    value={formData.designation}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, designation: val, state_id: "", zone_id: "", center_id: "" }))}
                  >
                    <SelectTrigger className="w-full  rounded-none h-11">
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Centre Lawyer">Centre Lawyer</SelectItem>
                      <SelectItem value="State Lawyer">State Lawyer</SelectItem>
                      <SelectItem value="Zonal Lawyer">Zonal Lawyer</SelectItem>
                      <SelectItem value="Head Quarter">Head Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                  {serverErrors.designation && (
                    <p className="text-red-500 text-sm">
                      {serverErrors.designation[0]}
                    </p>
                  )}
                </div>
              )}

              {/* Paralegal Designation */}
              {formData.user_type === "INTERNAL PARALEGAL" && (
                <div className="space-y-1">
                  <Label>
                    Designation <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    key={formData.designation + state?.status}
                    name="designation"
                    value={formData.designation}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, designation: val, state_id: "", zone_id: "", center_id: "" }))}
                  >
                    <SelectTrigger className="w-full  rounded-none h-11">
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Head Office">Head Office</SelectItem>
                      <SelectItem value="Zonal Office">Zonal Office</SelectItem>
                      <SelectItem value="State Office">State Office</SelectItem>
                    </SelectContent>
                  </Select>
                  {serverErrors.designation && (
                    <p className="text-red-500 text-sm">
                      {serverErrors.designation[0]}
                    </p>
                  )}
                </div>
              )}

              {/* State Selection */}
              {scope.state && (
                <div className="space-y-1">
                  <Label>
                    Select State <span className="text-red-500">*</span>
                  </Label>
                  <GetState
                    key={formData.user_type + formData.designation}
                    value={formData.state_id}
                    onValueChange={(val: string) => setFormData(prev => ({ ...prev, state_id: val, center_id: "" }))}
                    placeholder="Select state"
                  />

                  {serverErrors.state_id && (
                    <p className="text-red-500 text-sm">
                      {serverErrors.state_id[0]}
                    </p>
                  )}
                </div>
              )}
              {scope.center && (
                <div className="space-y-1">
                  <Label>
                    Select Center <span className="text-red-500">*</span>
                  </Label>
                  <GetInvitationCenter
                    key={formData.state_id}
                    stateId={formData.state_id}
                    value={formData.center_id}
                    onValueChange={(val) => handleChange("center_id", val)}
                  />
                  {serverErrors.center_id && (
                    <p className="text-red-500 text-sm">
                      {serverErrors.center_id[0]}
                    </p>
                  )}
                </div>
              )}

              {/* Zone Selection */}
              {scope.zone && (
                <div className="space-y-1">
                  <Label>
                    Zone Selection <span className="text-red-500">*</span>
                  </Label>
                  <GetZone
                    key={formData.user_type + formData.designation}
                    value={formData.zone_id}
                    onValueChange={(val: string) => handleChange("zone_id", val)}
                    placeholder="Select your zone"
                  />

                  {serverErrors.zone_id && (
                    <p className="text-red-500 text-sm">
                      {serverErrors.zone_id[0]}
                    </p>
                  )}
                </div>
              )}

              {/* First Name */}
              <InputField
                type="text"
                label="First Name"
                required
                name="first_name"
                className={
                  serverErrors.first_name ? "border-red-500 bg-red-50" : ""
                }
                placeholder="Enter First name"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
              />
              {serverErrors.first_name && (
                <p className="text-red-500 text-sm">
                  {serverErrors.first_name[0]}
                </p>
              )}

              {/* Last Name */}
              <InputField
                label="Last Name"
                type="text"
                required
                name="last_name"
                className={
                  serverErrors.last_name ? "border-red-500 bg-red-50" : ""
                }
                placeholder="Enter Last name"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
              />
              {serverErrors.last_name && (
                <p className="text-red-500 text-sm">
                  {serverErrors.last_name[0]}
                </p>
              )}

              {/* Email */}
              <InputField
                label="LACON Email Address"
                type="email"
                required
                name="email"
                className={serverErrors.email ? "border-red-500 bg-red-50" : ""}
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {serverErrors.email && (
                <p className="text-red-500 text-sm">{serverErrors.email[0]}</p>
              )}

              {/* Phone Number */}
              <InputField
                type="tel"
                label="Phone Number"
                required
                className={
                  serverErrors.phone_number ? "border-red-500 bg-red-50" : ""
                }
                name="phone_number"
                placeholder="Enter phone number"
                value={formData.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
              />
              {serverErrors.phone_number && (
                <p className="text-red-500 text-sm">
                  {serverErrors.phone_number[0]}
                </p>
              )}

         
            </>
          )}

          <SubmitButton
            value="Create User"
            loading={isPending}
            pendingValue="Creating User..."
            className="w-full text-white h-12 rounded mt-2"
          />
        </form>
      </CustomeSheet>
    </>
  );
}
