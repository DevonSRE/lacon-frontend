import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface CaseIntakeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    handleCloseCaseType?: (open: boolean) => void
    isHome?: boolean
    caseReference?: string
    // Public filings: where the confirmation went and who reviews the case.
    email?: string
    // Only set when the office is known; left out, the dialog promises no one.
    reviewer?: string
    // The role now holding the case, when the API routed it (FCT cases go to the HQ heads).
    holderRole?: string
}

const REVIEWERS: Record<string, string> = {
    "CIVIL JUSTICE DEPT. HEAD": "the Civil Justice Department Head",
    "CRIMINAL JUSTICE DEPT. HEAD": "the Criminal Justice Department Head",
    "PDSS UNIT HEAD": "the PDSS Unit Head",
    "DIRECTOR GENERAL": "the Director General",
}

export default function CaseIntakeDialog({
    open,
    onOpenChange,
    handleCloseCaseType,
    isHome,
    caseReference,
    email,
    reviewer,
    holderRole,
}: CaseIntakeDialogProps) {
    // Only name a reviewer the API actually gave us. The default used to be "the
    // State Coordinator for your state", so a case filed where that office is
    // empty told the client someone would review it who does not exist
    // (QA 2026-11-01, item 27).
    const reviewedBy = (holderRole && REVIEWERS[holderRole]) || reviewer || "";
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-6">
                <Card className="border-none shadow-none">
                    <CardContent className="flex flex-col items-center space-y-6 p-0">
                        <CheckCircle className="text-green-600 w-12 h-12" />
                        <DialogTitle className="text-xl font-semibold">Case Intake Submitted</DialogTitle>

                        {isHome ? (
                            <div className="space-y-3 text-center text-sm text-gray-600">
                                {caseReference && (
                                    <p className="rounded bg-green-50 px-4 py-2 font-semibold text-green-800">
                                        Your reference is {caseReference}
                                    </p>
                                )}
                                <p>Quote this reference whenever you contact LACON about your case.</p>
                                {email && <p>We have sent a confirmation email to <span className="font-medium text-gray-900">{email}</span>.</p>}
                                <p>
                                    {reviewedBy
                                        ? <>Your case will be reviewed by {reviewedBy}.</>
                                        : <>Your case is in the queue for review by the LACON office that handles cases from your state.</>}
                                    {" "}Acceptance is not guaranteed; we will email you the decision.
                                </p>
                            </div>
                        ) : caseReference ? (
                            <p className="rounded bg-green-50 px-4 py-2 text-center text-sm font-semibold text-green-800">
                                Case {caseReference} filed
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600 text-center">
                                The case intake form has been successfully<br />
                                recorded in our system.
                            </p>
                        )}
                        {!isHome ? (
                            <Button onClick={() => { handleCloseCaseType?.(false); onOpenChange(false) }} className="w-full h-11 bg-black text-white hover:bg-gray-800">
                                Close
                            </Button>
                        ) :
                            <Button className="w-full h-11 bg-black text-white hover:bg-gray-800">
                                <Link href="/">
                                    Back to Home
                                </Link>
                            </Button>
                        }

                    </CardContent>
                </Card>
            </DialogContent >
        </Dialog >
    )
}
