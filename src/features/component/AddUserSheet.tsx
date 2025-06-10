"use client";

import { useActionState, useEffect, useState } from "react";
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
import { InviteUser } from "../dashboard/server/action";
import { SubmitButton } from "@/components/submit-button";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";
import { CLIENT_ERROR_STATUS } from "@/lib/constants";
import InputField from "@/components/form/input/InputField";
import { isFieldErrorObject } from "@/types/auth";
import { FormDataUser, zones } from "../dashboard/server/type";
import { GetState } from "@/components/get-state";
import { ScrollArea } from "@/components/ui/scroll-area";


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
    const { isOpen, setIsOpen } = useAction();
    const [state, dispatch, isPending] = useActionState(InviteUser, undefined);
    const [formData, setFormData] = useState<FormDataUser>(defaultFormData);
    const [selectedState, setSelectedState] = useState<string>("");

    const handleChange = (key: keyof FormDataUser, value: string) => {
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

    const serverErrors = isFieldErrorObject(state?.errors) ? state.errors : {};
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent>
                <ScrollArea className="h-screen w-full rounded-md border p-4">
                    <form className="space-y-6 p-6 mt-10" action={dispatch}>
                        <h2 className="text-xl font-semibold">Add New User</h2>

                        <div className="space-y-1">
                            <Label>User Type</Label>
                            <Select key={formData.user_type + state?.status}
                                name="user_type"
                                value={formData.user_type}
                                onValueChange={(val) => handleChange("user_type", val)}>
                                <SelectTrigger className="w-full  rounded-none h-11">
                                    <SelectValue placeholder="Select User Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {userTypeOptions.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.user_type !== "" && (
                            <>
                                {/* LacON Lawyer Designation */}
                                {formData.user_type === "LACON LAWYER" && (
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
                                            <SelectTrigger className={`w-full ${serverErrors.designation ? 'border-red-500' : ''}`}>
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
                                            <p className="text-red-500 text-sm">{serverErrors.designation[0]}</p>
                                        )}
                                    </div>
                                )}

                                {/* Paralegal Designation */}
                                {formData.user_type === "PARALEGAL" && (
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
                                            <SelectTrigger className={`w-full ${serverErrors.designation ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder="Select Designation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Head Office">Head Office</SelectItem>
                                                <SelectItem value="Zonal Office">Zonal Office</SelectItem>
                                                <SelectItem value="State Office">State Office</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {serverErrors.designation && (
                                            <p className="text-red-500 text-sm">{serverErrors.designation[0]}</p>
                                        )}
                                    </div>
                                )}

                                {/* State Selection */}
                                {(formData.user_type === "STATE COORDINATOR" || formData.user_type === "CENTRE COORDINATOR" || formData.user_type === "LACON LAWYER") && (
                                    <div className="space-y-1">
                                        <Label>
                                            Select State <span className="text-red-500">*</span>
                                        </Label>
                                        <GetState
                                            value={selectedState}
                                            onValueChange={(val: string) => setSelectedState(val)}
                                            placeholder="Select state"
                                        />

                                        {serverErrors.state_id && (
                                            <p className="text-red-500 text-sm">{serverErrors.state_id[0]}</p>
                                        )}
                                    </div>
                                )}
                                {(formData.user_type === "CENTRE COORDINATOR") && (
                                    <div className="space-y-1">
                                        <Label>
                                            Select Center <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            key={formData.center_id + state?.status}
                                            name="center_id"
                                            value={formData.center_id}
                                            onValueChange={(val) => handleChange("center_id", val)}>
                                            <SelectTrigger className={`w-full ${serverErrors.center_id ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder="Select Designated Center" />
                                            </SelectTrigger>
                                            <SelectContent className="h-60 overflow-y-auto">
                                                <SelectItem value="Center A"> Center A</SelectItem>
                                                <SelectItem value="Center B"> Center B</SelectItem>
                                                <SelectItem value="Center C"> Center C</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {serverErrors.center_id && (
                                            <p className="text-red-500 text-sm">{serverErrors.center_id[0]}</p>
                                        )}
                                    </div>
                                )}

                                {/* Zone Selection */}
                                {(formData.user_type === "ZONAL DIRECTOR" || formData.designation === "CENTRE COORDINATOR") && (
                                    <div className="space-y-1">
                                        <Label>
                                            Zone Selection <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            key={formData.zone_id + state?.status}
                                            name="zone"
                                            value={formData.zone_id}
                                            onValueChange={(val) => handleChange("zone_id", val)}
                                        >
                                            <SelectTrigger className={`w-full ${serverErrors.zone_id ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder="Select Political Zone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {zones.map((zone) => (
                                                    <SelectItem key={zone} value={zone}>
                                                        {zone}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {serverErrors.zone_id && (
                                            <p className="text-red-500 text-sm">{serverErrors.zone_id[0]}</p>
                                        )}
                                    </div>
                                )}

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

                                {(formData.user_type === "LACON LAWYER" || formData.designation === "PRO BONO LAWYER") && (
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
                </ScrollArea >
            </SheetContent>
        </Sheet>
    );
}