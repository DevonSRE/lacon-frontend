import { SubmitButton } from '@/components/submit-button';
import { ILawyerManagement } from '@/types/case';
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect, useState, useTransition } from "react";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

import InputField from "@/components/form/input/InputField";
import { UpdateLawyer } from '@/features/dashboard/server/action';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import LoadingDialog from '@/components/LoadingDialog';
import { useQueryClient } from '@tanstack/react-query';

interface RecentCase {
    caseTitle: string;
    type: string;
    status: string;
    lastUpdated: string;
}

interface LawyerDetailsProps {
    lawyer?: ILawyerManagement | null;
    recentCases?: RecentCase[];
    sheetType?: "view" | "edit" | "suspend" | "delete" | null;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ViewEditLawyer({ lawyer, setOpen: OpenSheet, recentCases, sheetType }: LawyerDetailsProps) {
    const queryClient = useQueryClient();

    // Add missing state and hooks for the edit form
    const [formData, setFormData] = useState({
        first_name: lawyer?.first_name || '',
        last_name: lawyer?.last_name || '',
        email: lawyer?.email || '',
        phone_number: lawyer?.phone_number || '',
        user_type: lawyer?.user_type || '',
        status: lawyer?.status || '',
        max_load: lawyer?.max_case_load?.toString() || ''
    });

    // Simplified loading dialog state
    const [dialogState, setDialogState] = useState({
        open: false,
        title: "",
        details: ""
    });

    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
    const [state, dispatch] = useActionState(UpdateLawyer, undefined);
    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle server response
    useEffectAfterMount(() => {
        if (state && CLIENT_ERROR_STATUS.includes(state?.status)) {
            // Hide loading dialog on error
            setDialogState({ open: false, title: "", details: "" });

            toast.error(state?.message, {
                description: typeof state?.errors === "string"
                    ? state.errors
                    : state?.errors
                        ? Object.values(state.errors).flat().join(", ")
                        : undefined,
            });

        } else if (state?.status === 200 || state?.status === 201) {
            // Show success state
            setDialogState({
                open: true,
                title: "done",
                details: "Lawyer updated successfully!"
            });


            queryClient.invalidateQueries({ queryKey: ["getLaweyersManagement"] });

            // toast.success("Lawyer updated successfully!");
            // Close dialog and sheet after a delay
            setTimeout(() => {
                setDialogState({ open: false, title: "", details: "" });
                OpenSheet(false);
            }, 2000);
        }
    }, [state]);

    const dispatchAction = (formData: FormData) => {
        startTransition(() => {
            // Show loading dialog
            setDialogState({
                open: true,
                title: "loading",
                details: "Updating lawyer..."
            });

            // Small delay to ensure state is set before dispatch
            setTimeout(() => {
                startTransition(() => {
                    formData.append("id", String(lawyer?.id));
                    dispatch(formData);
                });
            }, 100);

        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'in progress':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'completed':
                return 'text-gray-600 bg-gray-50 border-gray-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'criminal':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'civil':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div>
            <LoadingDialog
                open={dialogState.open}
                onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}
                details={dialogState.details}
                title={dialogState.title}
            />

            {sheetType === "view" && (
                <div className="space-y-10">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-xl font-bold text-gray-900">Lawyer Details</h1>
                    </div>

                    {/* Lawyer Information Section */}
                    <div className="text-xs">
                        <div className="mb-6 bg-gray-100 rounded-sm p-6">
                            <h2 className="text-md font-semibold text-gray-800 mb-4">Lawyer Information</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-3">
                                    <div className='flex justify-between'>
                                        <div className="font-medium text-gray-500">Full Name:</div>
                                        <div className="text-gray-900">{lawyer?.first_name} {lawyer?.last_name}</div>
                                    </div>

                                    <div className='flex justify-between'>
                                        <div className="font-medium text-gray-500">LACON Email Address:</div>
                                        <div className="text-gray-900">{lawyer?.email ?? "-"}</div>
                                    </div>

                                    <div className='flex justify-between'>
                                        <div className="font-medium text-gray-500">Phone Number:</div>
                                        <div className="text-gray-900">{lawyer?.phone_number ?? "-"}</div>
                                    </div>

                                    <div className='flex justify-between'>
                                        <div className="font-medium text-gray-500">Role:</div>
                                        <div className="text-gray-900">{lawyer?.user_type ?? "-"}</div>
                                    </div>

                                    <div className='flex justify-between'>
                                        <div className="font-medium text-gray-500">Assigned State:</div>
                                        <div className="text-gray-900">{lawyer?.state ?? "-"}</div>
                                    </div>

                                    <div className='flex justify-between'>
                                        <div className="font-medium text-gray-500">Assigned Centre:</div>
                                        <div className="text-gray-900">{lawyer?.center_name ?? "-"}</div>
                                    </div>

                                    <div className='flex justify-between'>
                                        <div className="font-medium text-gray-500">Status:</div>
                                        <div className="text-gray-900">
                                            {lawyer?.status ?? "-"}
                                        </div>
                                    </div>

                                    <div className='flex justify-between'>
                                        <div className="font-medium text-gray-500">Max. Case Load:</div>
                                        <div className="text-gray-900 font-medium">{lawyer?.max_case_load ?? "-"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Cases Section */}
                        <h2 className="font-semibold text-gray-800 mb-4">Recent Cases Assigned</h2>
                        <div className="mb-6 bg-gray-100 rounded-sm p-6">
                            <div className="space-y-4">
                                {(recentCases ?? []).map((case_, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Case Title:</label>
                                                    <p className="text-gray-900 font-medium">{case_.caseTitle}</p>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Type:</label>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ml-2 ${getTypeColor(case_.type)}`}>
                                                        {case_.type}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Status:</label>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ml-2 ${getStatusColor(case_.status)}`}>
                                                        {case_.status}
                                                    </span>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Last Updated:</label>
                                                    <p className="text-gray-900">{case_.lastUpdated}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {sheetType === "edit" && (
                <form className="space-y-4 p-6 mt-5" action={dispatchAction}>
                    <h2 className="text-xl font-semibold">Edit Lawyer</h2>

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
                        placeholder="Enter email address"
                        readOnly
                        value={formData.email}
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
                                {/* <SelectItem value="NYSC Lawyer">NYSC Lawyer</SelectItem> */}
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
                            onValueChange={(val) => handleChange("status", val)}
                        >
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
                        value="Update Lawyer"
                        loading={dialogState.open && dialogState.title === "loading"}
                        pendingValue="Updating Lawyer..."
                        className="w-full text-white h-12 rounded mt-2"
                    />
                </form>
            )}
        </div>
    );
};