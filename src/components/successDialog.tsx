import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface SuccessDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    details: string
    title: string
}

export default function SuccessDialog({
    open,
    onOpenChange,
    details,
    title,
}: SuccessDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-6">
                <Card className="border-none shadow-none">
                    <CardContent className="flex flex-col items-center space-y-6 p-0">
                        <CheckCircle className="text-green-600 w-12 h-12" />
                        <h2 className="text-xl font-semibold">{title}</h2>

                        <p className="text-sm text-gray-600 text-center">
                            {details}
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
