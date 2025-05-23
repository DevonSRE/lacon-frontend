"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus } from "lucide-react"
import { states, UserType, Zone } from "@/lib/types"

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

export const zones: Zone[] = [
    'North West', 'North East', 'North Central',
    'South West', 'South East', 'South South'
];
export function AddUserSheet() {
    const [formData, setFormData] = useState({
        userType: "",
        designation: "",
        state: "",
        zone: "",
        fullName: "",
        email: "",
        phone: "",
    })

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-sm">
                    <Plus size={20} className="mr-2" />
                    New User
                </Button>
            </SheetTrigger>
            <SheetContent>
                <form className="space-y-6 p-6 mt-10">
                    <h2 className="text-xl font-semibold">Add New User</h2>

                    {/* User Type */}
                    <div className="space-y-1">
                        <Label>User Type</Label>
                        <Select onValueChange={(val) => handleChange("userType", val)}>
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

                    {formData.userType != "" && (
                        <>
                            {(formData.userType === "LacON Lawyer") && (
                                <div className="space-y-1">
                                    <Label>Designation</Label>
                                    <Select onValueChange={(val) => handleChange("designation", val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Designation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Centre Lawyer">Centre Lawyer</SelectItem>
                                            <SelectItem value="State Lawyer">State Lawyer</SelectItem>
                                            <SelectItem value="Head Quarter">Head Quarter</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {(formData.userType === "Paralegal") && (
                                <div className="space-y-1">
                                    <Label>Designation</Label>
                                    <Select onValueChange={(val) => handleChange("designation", val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Designation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Head Office">Head Office</SelectItem>
                                            <SelectItem value="Zonal Office">Zonal Office</SelectItem>
                                            <SelectItem value="State Office">State Office</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {(formData.userType === "State Coordinator" || formData.userType === "Centre Coordinator" || formData.designation === "State Lawyer"  || formData.designation === "State Office" ) && (
                                <div className="space-y-1">
                                    <Label>Select State</Label>
                                    <Select onValueChange={(val) => handleChange("state", val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Designated State" />
                                        </SelectTrigger>
                                        <SelectContent className="h-60 overflow-y-auto">
                                            {states.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {(formData.userType === "Centre Coordinator" || formData.userType === "Centre Coordinator"  ) && (
                                <div className="space-y-1">
                                    <Label>Select Centre</Label>
                                    <Select onValueChange={(val) => handleChange("state", val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Designated State" />
                                        </SelectTrigger>
                                        <SelectContent className="h-60 overflow-y-auto">
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {(formData.userType === "Zonal Director" || formData.designation === "Centre Lawyer" || formData.designation === "Zonal Office") && (
                                <div className="space-y-1">
                                    <Label>Zone Selection</Label>
                                    <Select onValueChange={(val) => handleChange("zone", val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Political Zone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {zones.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}



                            <div className="space-y-1">
                                <Label>Full Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter full name"
                                    value={formData.fullName}
                                    onChange={(e) => handleChange("fullName", e.target.value)}
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <Label>LACON Email Address</Label>
                                <Input
                                    type="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-1">
                                <Label>Phone Number</Label>
                                <Input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                />
                            </div>
                        </>

                    )}

                    {/* Submit */}
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                        Create
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    )
}
