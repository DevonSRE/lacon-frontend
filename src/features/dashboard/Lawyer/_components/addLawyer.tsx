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
import { states, userTypeOptions } from "@/lib/types";
import { useAction } from "@/context/ActionContext";
import { SubmitButton } from "@/components/submit-button";
import { useFormState } from "react-dom";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";
import { CLIENT_ERROR_STATUS } from "@/lib/constants";
import InputField from "@/components/form/input/InputField";
import { isFieldErrorObject } from "@/types/auth";
import { FormDataLawyer } from "../../server/type";
import { InviteLawyer, InviteUser } from "../../server/action";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";

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
    const { isOpen, setIsOpen } = useAction();
    const [state, dispatch, isPending] = useActionState(InviteLawyer, undefined);
    const [formData, setFormData] = useState<FormDataLawyer>(defaultFormData);
    const [dailogOpen, setDialogOpen] = useState(false);
    const handleChange = (key: keyof FormDataLawyer, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };
    useEffectAfterMount(() => {
        if (state && CLIENT_ERROR_STATUS.includes(state?.status)) {
            toast.error(state?.message, {
                description: typeof state?.errors === "string"
                    ? state.errors
                    : state?.errors
                        ? Object.values(state.errors).flat().join(", ")
                        : undefined,
            });
        } else if (state?.status === 200 || state?.status === 201) {
            toast.success("User invited successfully!");
            setIsOpen(false);
            setFormData(defaultFormData); // ✅ Reset form on success
        }
    }, [state]);

    useEffect(() => {
        setDialogOpen(true);
    }, [isPending])

    const serverErrors = isFieldErrorObject(state?.errors) ? state.errors : {};
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent>
                <div className="space-y-10 p-4 mt-4">
                    <span><ArrowLeft onClick={() => setIsOpen(false)} /></span>
                    <ScrollArea className="h-screen mt-4">
                        <form className="space-y-4" action={dispatch}>
                            <h2 className="text-xl font-semibold">Add New Lawyer</h2>
                            {/* First Name */}
                            <InputField
                                type="text"
                                label="First Name"
                                required
                                name="first_name"
                                className={serverErrors.first_name ? 'border-red-500 bg-red-50' : ''}
                                placeholder="Enter First name"
                                value={formData.first_name}
                                onChange={(e) => handleChange("first_name", e.target.value)}
                            />
                            {serverErrors.first_name && (
                                <p className="text-red-500 text-sm">{serverErrors.first_name[0]}</p>
                            )}

                            {/* Last Name */}
                            <InputField
                                label="Last Name"
                                type="text"
                                required
                                name="last_name"
                                className={serverErrors.last_name ? 'border-red-500 bg-red-50' : ''}
                                placeholder="Enter Last name"
                                value={formData.last_name}
                                onChange={(e) => handleChange("last_name", e.target.value)}
                            />
                            {serverErrors.last_name && (
                                <p className="text-red-500 text-sm">{serverErrors.last_name[0]}</p>
                            )}

                            {/* Email */}
                            <InputField
                                label="LACON Email Address"
                                type="email"
                                required
                                name="email"
                                className={serverErrors.email ? 'border-red-500 bg-red-50' : ''}
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
                                className={serverErrors.phone_number ? 'border-red-500 bg-red-50' : ''}
                                name="phone_number"
                                placeholder="Enter phone number"
                                value={formData.phone_number}
                                onChange={(e) => handleChange("phone_number", e.target.value)}
                            />
                            {serverErrors.phone_number && (
                                <p className="text-red-500 text-sm">{serverErrors.phone_number[0]}</p>
                            )}
                            <div className="space-y-1">
                                <Label>Role <span className="text-red-500">*</span></Label>
                                <Select
                                    key={formData.user_type + state?.status}
                                    name="user_type"
                                    value={formData.user_type}
                                    onValueChange={(val) => handleChange("user_type", val)}
                                >
                                    <SelectTrigger className={`w-full h-11 ${serverErrors.user_type ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LACON LAWYER">LACON Lawyer</SelectItem>
                                        <SelectItem value="PRO BONO LAWYER">Pro bono Lawyer</SelectItem>
                                        <SelectItem value="NYSC Lawyer">NYSC Lawyer</SelectItem>
                                    </SelectContent>
                                </Select>
                                {serverErrors.user_type && (
                                    <p className="text-red-500 text-sm">{serverErrors.user_type[0]}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label>Status <span className="text-red-500">*</span></Label>
                                <Select
                                    key={formData.status + state?.status}
                                    name="status"
                                    value={formData.status}
                                    onValueChange={(val) => handleChange("status", val)}>
                                    <SelectTrigger className={`w-full h-11 ${serverErrors.status ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                {serverErrors.status && (
                                    <p className="text-red-500 text-sm">{serverErrors.status[0]}</p>
                                )}
                            </div>
                            <div>
                                <InputField
                                    label="Max Case Load"
                                    type="number"
                                    required
                                    name="max_load"
                                    className={serverErrors.max_load ? 'border-red-500 bg-red-50' : ''}
                                    placeholder="Enter Maximum case"
                                    value={formData.max_load}
                                    onChange={(e) => handleChange("max_load", e.target.value)}
                                />
                                {serverErrors.max_load && (
                                    <p className="text-red-500 text-sm">{serverErrors.max_load[0]}</p>
                                )}
                            </div>

                            {state?.errors && typeof state.errors === 'object' && (
                                <div className="text-red-500 bg-red-50 p-4 rounded">
                                    <h3 className="font-semibold mb-2">Please fix the following errors:</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {Object.entries(state.errors).map(([key, val]) =>
                                            Array.isArray(val)
                                                ? val.map((msg, idx) => (
                                                    <li key={`${key}-${idx}`}>{key.replace(/_/g, ' ')}: {msg}</li>
                                                ))
                                                : <li key={key}>{key.replace(/_/g, ' ')}: {String(val)}</li>
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