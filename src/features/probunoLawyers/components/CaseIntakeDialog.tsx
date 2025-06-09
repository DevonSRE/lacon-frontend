import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface CaseIntakeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    caseReference: string
}

export default function CaseIntakeDialog({
    open,
    onOpenChange,
    caseReference,
}: CaseIntakeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-6">
                <Card className="border-none shadow-none">
                    <CardContent className="flex flex-col items-center space-y-6 p-0">
                        <CheckCircle className="text-green-600 w-12 h-12" />
                        <h2 className="text-xl font-semibold">Case Intake Submitted</h2>
                        <div className="bg-gray-100 w-full py-2 rounded-md text-sm font-medium text-gray-700 text-center">
                            Case Reference: {caseReference}
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                            The case intake form has been successfully<br />
                            recorded in our system.
                        </p>
                        <Button className="w-full h-11 bg-black text-white hover:bg-gray-800">
                            <Link href="/">
                                Back to Home
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
