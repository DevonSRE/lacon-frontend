import { CheckCircle } from "lucide-react"
import Image from "next/image";
import { Dialog, DialogContent, } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

interface LoadingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    details: string
    title: string
}

export default function LoadingDialog({
    open,
    onOpenChange,
    details,
    title,
}: LoadingDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-6">
                <Card className="border-none shadow-none">
                    <CardContent className="flex flex-col items-center space-y-6 p-0">
                        {(title.toLowerCase() === "loading") && (
                            <Image src="/loading.gif" alt={""} width={100} height={20} className="h-30 w-30" />
                        )}
                        {(title === "done") && (
                            <CheckCircle className="text-green-600 w-24 h-24" />
                        )}
                        <p className="text-md text-gray-600 text-center">
                            {details}
                        </p>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
