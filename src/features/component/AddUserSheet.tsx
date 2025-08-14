

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
import { CLIENT_ERROR_STATUS } from "@/lib/constants";
import InputField from "@/components/form/input/InputField";
import { isFieldErrorObject, ROLES } from "@/types/auth";
import { FormDataUser, zones } from "../dashboard/server/type";
import { GetState } from "@/components/get-state";
import { CustomeSheet } from "@/components/CustomSheet";
import LoadingDialog from "@/components/LoadingDialog";
import { useQueryClient } from "@tanstack/react-query";
import { GetZone } from "@/components/get-zone";
import { GetActiveUser } from "@/components/get-active-users";
import { GetInactiveState } from "@/components/get-inactive-state";

const defaultFormData: FormDataUser = {
  user_type: "",
  designation: "",
  state_id: "",
  center_id: "",
  zone_id: "",
  max_load: "",
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
  const [selectedState, setSelectedState] = useState<string>("");
  const [userType, setSelectedUserType] = useState<string>("");
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (key: keyof FormDataUser, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  useEffectAfterMount(() => {
    if (state && CLIENT_ERROR_STATUS.includes(state?.status)) {
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
      setTimeout(() => {
        setLoadingDialog({ open: false, title: "", details: "" });
      }, 2000);
    }
  }, [state]);
  const serverErrors = isFieldErrorObject(state?.errors) ? state.errors : {};
  const dispatchAction = (formData: FormData) => {
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
  }, [isPending]);

  return (
    <>
      <LoadingDialog
        open={openLoadingDialog.open}
        onOpenChange={(open) => setLoadingDialog((prev) => ({ ...prev, open }))}
        details={openLoadingDialog.details}
        title={openLoadingDialog.title}
      />
      <CustomeSheet open={isOpen} setOpen={setIsOpen} className="sm:w-[600px]">
        <form className="space-y-6" action={dispatchAction}>
          <h2 className="text-xl font-semibold">Add New User</h2>
          <div className="space-y-1">
            <Label>User Role</Label>
            <GetActiveUser
              value={userType}
              onValueChange={(val: string) => {
                setSelectedUserType(val);
                handleChange("user_type", val);
              }}
              placeholder="Select User Type"
              onLoadingChange={(loading) => setLoading(loading)}
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
                    onValueChange={(val) => handleChange("designation", val)}
                  >
                    <SelectTrigger className="w-full  rounded-none h-11">
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Centre Lawyer">
                        Centre Lawyer
                      </SelectItem>
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
                    onValueChange={(val) => handleChange("designation", val)}
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
              {(
                (formData.designation === "State Office" && formData.user_type === "INTERNAL PARALEGAL") ||
                formData.user_type === "STATE COORDINATOR" || formData.user_type === "CENTRE COORDINATOR" ||

                (formData.user_type === "LACON LAWYER" && (formData.designation === "State Lawyer" || formData.designation === "Centre Lawyer")) ||

               (formData.user_type === "PRO BONO LAWYER" && (formData.designation === "State Lawyer" || formData.designation === "Centre Lawyer")) 
                  // (formData.designation === "State Office" ||  formData.designation === "Center Lawyer")

                ) && (
                <div className="space-y-1">
                  <Label>
                    Select State <span className="text-red-500">*</span>
                  </Label>
                  <GetInactiveState
                    value={selectedState}
                    onValueChange={(val: string) => setSelectedState(val)}
                    placeholder="Select state"
                  />

                  {serverErrors.state_id && (
                    <p className="text-red-500 text-sm">
                      {serverErrors.state_id[0]}
                    </p>
                  )}
                </div>
              )}
              {
                (
              formData.user_type === "CENTRE COORDINATOR"  ||
               (formData.user_type === "PRO BONO LAWYER" && formData.designation === "Centre Lawyer") ||
               (formData.user_type === "LACON LAWYER" && formData.designation === "Centre Lawyer") 

                )
              && (
                <div className="space-y-1">
                  <Label>
                    Select Center <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    key={formData.center_id + state?.status}
                    name="center_id"
                    value={formData.center_id}
                    onValueChange={(val) => handleChange("center_id", val)}
                  >
                    <SelectTrigger
                      className={`w-full ${
                        serverErrors.center_id ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Designated Center" />
                    </SelectTrigger>
                    <SelectContent className="h-60 overflow-y-auto">
                      <SelectItem value="Center A"> Center A</SelectItem>
                      <SelectItem value="Center B"> Center B</SelectItem>
                      <SelectItem value="Center C"> Center C</SelectItem>
                    </SelectContent>
                  </Select>
                  {serverErrors.center_id && (
                    <p className="text-red-500 text-sm">
                      {serverErrors.center_id[0]}
                    </p>
                  )}
                </div>
              )}

              {/* Zone Selection */}
              {(formData.user_type === "ZONAL DIRECTOR" ||
                formData.designation === "CENTRE COORDINATOR" ||
                formData.designation === "Zonal Office" ||

                   (formData.user_type === "LACON LAWYER" && formData.designation === "Zonal Lawyer") ||

               (formData.user_type === "PRO BONO LAWYER" && formData.designation === "Zonal Lawyer")
              
              
              ) && (
                <div className="space-y-1">
                  <Label>
                    Zone Selection <span className="text-red-500">*</span>
                  </Label>
                  <GetZone
                    value={selectedState}
                    onValueChange={(val: string) => setSelectedState(val)}
                    placeholder="Select your zone"
                    onLoadingChange={(loading) => setLoading(loading)}
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

              {(formData.user_type === "LACON LAWYER" ||
                formData.user_type === "PRO BONO LAWYER" ||
                formData.designation === "PRO BONO LAWYER") && (
                <div>
                  <InputField
                    label="Max Case Load"
                    type="number"
                    required
                    name="max_load"
                    className={
                      serverErrors.max_load ? "border-red-500 bg-red-50" : ""
                    }
                    placeholder="Enter Maximum case"
                    value={formData.max_load}
                    onChange={(e) => handleChange("max_load", e.target.value)}
                  />
                  {serverErrors.max_load && (
                    <p className="text-red-500 text-sm">
                      {serverErrors.max_load[0]}
                    </p>
                  )}
                </div>
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
