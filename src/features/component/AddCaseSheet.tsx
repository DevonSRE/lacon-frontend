"use client"


import { Label } from "@/components/ui/label"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import {
    Sheet,
    SheetTrigger,
    SheetContent,
} from "@/components/ui/sheet"
import { states, UserType, Zone } from "@/lib/types"
import SheetDemo from "./FileACase"

export const userTypeOptions: UserType[] = [
    'Director General',
    'Criminal Justice Department Head',
    'Civil Justice Department Head',
    'Decongestion Unit Head',
    'Prerogative Of Mercy Unit Head',
    'OSCAR Unit Head',
    'Dio',
    'Zonal Director',
    'State Coordinator',
    'Centre Coordinator',
    'LacON Lawyer',
    'Pro bono Lawyer',
    'Paralegal'
]

interface AddCaseSheetProps {
    open: boolean
    setOpen: (open: boolean) => void
}


// export function AddCaseSheet() {
export function AddCaseSheet({ open, setOpen }: AddCaseSheetProps) {
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="max-w-md p-6 space-y-6 pt-20">
                <h2 className="text-xl font-semibold">File A Case</h2>

                <div className="space-y-1">
                    <Label>User Type</Label>
                    <Select>
                        <SelectTrigger className="w-full">
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
                <SheetDemo/>
                {/* <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white mt-4">
                    Proceed
                </Button> */}
            </SheetContent>
        </Sheet>
    )
}
