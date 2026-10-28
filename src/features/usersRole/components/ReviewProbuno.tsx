import React, { Dispatch, ReactNode, SetStateAction, startTransition, useActionState, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SelectField from '@/components/SelectField';
import { ReviewProbuno } from '@/features/probunoLawyers/server/probonoSchema';
import TextAreaField from '@/components/TextAreaField';
import { Button } from '@/components/ui/button';
import { ILawyerRequest } from '@/types/case';
import LoadingDialog from '@/components/LoadingDialog';
import useEffectAfterMount from '@/hooks/use-effect-after-mount';
import { toast } from "sonner";
import { CLIENT_ERROR_STATUS } from '@/lib/constants';
import { AcceptRejectProbunoRequest } from '../server/action';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';


import { submitWithoutReset } from "@/lib/submit-without-reset";
interface DecisionData {
    decision: string;
    reason: string;
}
type CustomeDialigProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    children?: ReactNode;
    className?: string;
    user: ILawyerRequest | null,
};

// Defined outside the component so it isn't recreated (and remounted) on every render.
const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-start py-2 border-gray-200 last:border-b-0">
        <span className="text-xs font-medium text-gray-600 min-w-0 flex-shrink-0 mr-4">
            {label}:
        </span>
        <span className="text-xs text-gray-800 text-right">
            {value}
        </span>
    </div>
);

const readableDate = (raw?: string | null) => {
    if (!raw) return "-";
    const date = new Date(raw);
    return Number.isNaN(date.getTime())
        ? raw
        : date.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
};

const decisionLabels: Record<string, string> = { ACTIVE: "Approved", INACTIVE: "Declined", SUSPEND: "Suspended" };

export default function ReviewProbunoDialog({ user, setOpen }: CustomeDialigProps) {
    const decided = !!user && user.Status !== "PENDING";
    const [state, dispatch, isPending] = useActionState(AcceptRejectProbunoRequest, undefined);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    const queryClient = useQueryClient();
    const [decisionData, setDecisionData] = useState<DecisionData>({
        decision: '',
        reason: ''
    });
    const [dialogState, setDialogState] = useState({
        open: false,
        title: "",
        details: "",
    });
    const dispatchAction = (formData: FormData) => {
        startTransition(() => {
            dispatch(formData);
        });
    };
    useEffectAfterMount(() => {
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
                details: decisionData.decision === "approved" ? "Application approved." : "Application declined. The applicant has been emailed the reason.",
            });
            queryClient.invalidateQueries({ queryKey: ["getProbunoLawyersRequest"] });
            setTimeout(() => {
                setDialogState({ open: false, title: "", details: "" });
                if (decisionData.decision === "approved") {
                    router.push(`/users/designation-letter/${user?.ApplicationID ?? user?.ID}`);
                }
                setOpen(false);
            }, 2000);
        }
    }, [state, user?.ID]);

    const handleCancel = () => {
        setDecisionData({
            decision: '',
            reason: ''
        });
        setOpen(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (decisionData.decision === "rejected" && !decisionData.reason.trim()) {
            event.preventDefault();
            setErrors(prev => ({ ...prev, reason: "Enter a reason for declining" }));
            return;
        }
        submitWithoutReset(dispatchAction)(event);
    };

    const handleSelectChange = (value: string, name: keyof ReviewProbuno) => {
        setDecisionData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };


    return (
        <div className="mx-auto  mr-3 bg-white ">
            <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Review Pro Bono Lawyer Application
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Section 1: Personal Details and Office Info */}
                <div className="p-2 rounded-lg border-[1px] border-gray-200">
                    <h2 className="text-sm font-semibold mb-4 text-gray-700">
                        Section 1: Personal Details and Office Info
                    </h2>

                    <div className="space-y-1 bg-gray-50 p-4">
                        <InfoRow label="Full Name" value={[user?.FirstName, user?.LastName].filter(Boolean).join(" ") || "-"} />
                        <InfoRow label="Email" value={user?.Email || "-"} />
                        <InfoRow label="Phone" value={user?.PhoneNumber || "-"} />
                        <InfoRow label="Alt Number" value={user?.AltNumber || "-"} />
                        <InfoRow label="Most Contactable Number" value={user?.MostContactableNumber || "-"} />
                        <InfoRow label="State Bar Membership" value={user?.StateBarMembership || "-"} />
                        <InfoRow label="Law Firm/Organization" value={user?.LawFirmName || "-"} />
                        <InfoRow label="Firm Address" value={user?.LawFirmAddress || "-"} />
                        <InfoRow label="State of Practice" value={user?.StateOfPractice || "-"} />
                    </div>
                </div>

                {/* Right Column Sections */}
                <div className="space-y-8">
                    {/* Section 2: Criminal Law Experience */}
                    <div className="p-2 rounded-lg border-[1px] border-gray-200">
                        <h2 className="text-sm font-semibold mb-4 text-gray-700">
                            Section 2: Criminal Law Experience
                        </h2>
                        <div className="space-y-1 bg-gray-50 p-4">
                            <InfoRow label="Years of Experience" value={user?.Experience || "-"} />
                        </div>
                    </div>

                    {/* Section 3: Pro Bono Case Handling Capacity */}
                    <div className=" p-2 rounded-lg border-[1px] border-gray-200">
                        <h2 className="text-sm font-semibold mb-4 text-gray-700">
                            Section 3: Pro Bono Case Handling Capacity
                        </h2>

                        <div className="space-y-1 bg-gray-50 p-4">
                            <InfoRow label="Capacity" value={user?.MaxLoad || "-"} />
                        </div>
                    </div>

                    {/* Section 4: Criminal Matters Preference */}
                    <div className="p-2 rounded-lg border-[1px] border-gray-200">
                        <h2 className="text-sm font-semibold mb-4 text-gray-700">
                            Section 4: Criminal Matters Preference
                        </h2>
                        <div className="space-y-1 bg-gray-50 p-4">
                            <InfoRow label="Preferred Courts" value={user?.PreferredCourt || "-"} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 5: Submission Data */}
            <div className="grid grid-cols-2 lg:grid-cols-2 mt-8 mr-3">
                <div className='rounded-lg border-[1px] border-gray-200 p-2'>
                    <h2 className="text-sm font-semibold mb-4 text-gray-700">
                        Section 5: Submission Data
                    </h2>
                    <div className="max-w-md space-y-1 bg-gray-50 p-4">
                        <InfoRow label="Date of Submission" value={readableDate(user?.CreatedAt)} />
                    </div>
                </div>
            </div>


            <LoadingDialog
                open={isPending || dialogState.open}
                onOpenChange={(open) =>
                    setDialogState((prev) => ({ ...prev, open }))
                }
                details={isPending ? "Approving Request..." : dialogState.details}
                title={isPending ? "loading" : dialogState.title}
            />

            {/* Decision Section: read-only once the application has been decided. */}
            {decided ? (
                <div className="mt-8 bg-white p-6 rounded-lg border-[1px] border-gray-200">
                    <h2 className="text-sm font-semibold mb-4 text-gray-700">Decision</h2>
                    <div className="space-y-1 bg-gray-50 p-4">
                        <InfoRow label="Decision" value={decisionLabels[user?.Status ?? ""] ?? user?.Status ?? "-"} />
                        <InfoRow label="Reason" value={user?.DecisionReason || "-"} />
                        <InfoRow label="Decided by" value={user?.DecidedBy?.name || "-"} />
                        <InfoRow label="Decided on" value={readableDate(user?.DecidedAt)} />
                    </div>
                    {user?.Status === "ACTIVE" && (
                        <Button onClick={() => router.push(`/users/designation-letter/${user?.ApplicationID ?? user?.ID}`)} className="mt-4 bg-black text-white h-11">
                            View Letter of Designation
                        </Button>
                    )}
                </div>
            ) : (
            <div className="mt-8 bg-white p-6 rounded-lg border-[1px] border-gray-200">
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <input type="hidden" name="decision" value={decisionData.decision} />
                    <input type="hidden" name="lawyer_id" value={user?.ID} />
                    <div className='mb-4'>
                        <SelectField
                            name="decision"
                            label="Decision:"
                            placeholder="Select decision"
                            options={[
                                { value: 'approved', label: 'Accept' },
                                { value: 'rejected', label: 'Decline' }
                            ]}
                            required
                            value={decisionData.decision} // Add value prop
                            onValueChange={(value) => handleSelectChange(value, 'decision')}
                            error={!!errors.gender}
                            errorMessage={errors.gender}
                        />
                    </div>

                    <div className="mb-6">
                        <TextAreaField
                            name="reason"
                            label="Reason for Decision (required when declining):"
                            required={decisionData.decision === "rejected"}
                            placeholder="Why is this application being declined?"
                            value={decisionData.reason}
                            onChange={(e) => handleSelectChange(e.target.value, 'reason')}
                            error={errors.reason}
                        />
                    </div>

                    <div className="flex gap-4 text-xs">
                        <Button
                            type='submit'
                            disabled={!decisionData.decision}
                            className="flex-1 bg-black text-white h-11 py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isPending ? "Loading..." : "Yes, Submit Decision"}
                        </Button>
                        <Button onClick={handleCancel} className="flex-1 bg-white text-gray-700 h-11 py-3 px-6 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition duration-200">
                            No, Cancel
                        </Button>
                    </div>
                </form>

            </div>
            )}
        </div>
    );
};
