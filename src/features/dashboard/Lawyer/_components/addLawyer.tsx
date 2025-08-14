"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAction } from "@/context/ActionContext";
import { SubmitButton } from "@/components/submit-button";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";
import { CLIENT_ERROR_STATUS } from "@/lib/constants";
import InputField from "@/components/form/input/InputField";
import { isFieldErrorObject, ROLES } from "@/types/auth";
import { FormDataLawyer } from "../../server/type";
import { InviteLawyer, InviteUser } from "../../server/action";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { useQueryClient } from "@tanstack/react-query";
import { GetInactiveState } from "@/components/get-inactive-state";

const defaultFormData: FormDataLawyer = {
  user_type: "",
  designation: "",
  state: "",
  zone: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  role: "",
  status: "",
  max_load: "",
};

export function AddLawyerSheet() {
  const queryClient = useQueryClient();
  const { isOpen, setIsOpen } = useAction();
  const [state, dispatch, isPending] = useActionState(InviteLawyer, undefined);
  const [formData, setFormData] = useState<FormDataLawyer>(defaultFormData);
  const [dailogOpen, setDialogOpen] = useState(false);
  const { data: user } = useAppSelector((state) => state.profile);
  const role = user?.role;
  const handleChange = (key: keyof FormDataLawyer, value: string) => {
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
    } else if (state?.status === 200 || state?.status === 201) {
      queryClient.invalidateQueries({ queryKey: ["getLaweyersManagement"] });

      toast.success("User invited successfully!");
      setIsOpen(false);
      setFormData(defaultFormData); // ✅ Reset form on success
    }
  }, [state]);

  useEffect(() => {
    setDialogOpen(true);
  }, [isPending]);

  const serverErrors = isFieldErrorObject(state?.errors) ? state.errors : {};
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="p-4 w-full sm:max-w-[450px]">
        <div className="space-y-10 p-4 mt-4">
          <span>
            <ArrowLeft onClick={() => setIsOpen(false)} />
          </span>
          <ScrollArea className="h-screen mt-4">
            <form className="space-y-4 p-1" action={dispatch}>
              <h2 className="text-xl font-semibold">Add New Lawyer</h2>

              <div className="space-y-1">
                <Label>
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  key={formData.user_type + state?.status}
                  name="user_type"
                  value={formData.user_type}
                  onValueChange={(val) => handleChange("user_type", val)}
                >
                  <SelectTrigger
                    className={`w-full h-11 ${
                      serverErrors.user_type ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LACON LAWYER">LACON Lawyer</SelectItem>

                    {role === ROLES.DECONGESTION_UNIT_HEAD && (
                      <SelectItem value="PRO BONO LAWYER">
                        Pro bono Lawyer
                      </SelectItem>
                    )}

                    {role === ROLES.DIO && (
                      <SelectItem value="EXTERNAL PARALEGAL">
                        EXTERNAL PARALEGAL
                      </SelectItem>
                    )}
                    {role === ROLES.ZONAL_DIRECTOR ||
                    role === ROLES.STATE_COORDINATOR ||
                    role === ROLES.CENTRE_COORDINATOR ||
                    role === ROLES.CIVIL_JUSTICE_DEPT ||
                    role === ROLES.DIRECTOR_GENERAL ? (
                      <SelectItem value="INTERNAL PARALEGAL">
                        INTERNAL PARALEGAL
                      </SelectItem>
                    ) : (
                      <SelectItem value="NYSC Lawyer">NYSC Lawyer</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {serverErrors.user_type && (
                  <p className="text-red-500 text-sm">
                    {serverErrors.user_type[0]}
                  </p>
                )}
              </div>

              {/* <div className="space-y-1">
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
              </div> */}

              {/* <div className="space-y-1">
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
              </div> */}

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

              {state?.errors && typeof state.errors === "object" && (
                <div className="text-red-500 bg-red-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">
                    Please fix the following errors:
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(state.errors).map(([key, val]) =>
                      Array.isArray(val) ? (
                        val.map((msg, idx) => (
                          <li key={`${key}-${idx}`}>
                            {key.replace(/_/g, " ")}: {msg}
                          </li>
                        ))
                      ) : (
                        <li key={key}>
                          {key.replace(/_/g, " ")}: {String(val)}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <SubmitButton
                value="Create User"
                loading={isPending}
                pendingValue="Creating User..."
                className="w-full text-white h-12 rounded mt-2"
              />
            </form>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
