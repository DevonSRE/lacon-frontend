'use client'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "../../components/ui/label";
import InputField from "@/components/form/input/InputField";
import { SubmitButton } from "@/components/submit-button";

const RecoverComponent = () => {
    return (
        <>
            <div className="heading">
                <p className="font-bold text-3xl text-app-primary text-center">Recover Your Account</p>
                <p className="text-center text-xs space-x-2 mt-3">
                    <span className=" text-center text-sm text-bold text-gray-400">Enter your SCN ID or NIN, so we can send you account  recovery instructions.</span>
                </p>
            </div>

            <form className="w-full space-y-6">
                <div className="mt-6">
                    <Label className="text-sm font-bold text-neutral-600">
                        SELECT IDENTIFICATION  METHOD
                    </Label>
                    <Select>
                        <SelectTrigger className="w-full border-0 border-b-[1px] border-slate-300 font-bold text-neutral-700">
                            <SelectValue className="text-neutral-400 text-md " placeholder="Choose a method" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-zinc-900">
                            <SelectItem
                                value="NIN"
                                className="text-sm font-semibold text-zinc-900 hover:text-gray-600"
                            >
                                National Identity Number (NIN)
                            </SelectItem>
                            <SelectItem
                                value="IPN"
                                className="text-sm font-semibold text-zinc-900"
                            >
                                International Passport Number (IPN)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* <InputField
                    id="SELECT IDENTIFICATION METHOD"
                    type="text"
                    label="SELECT IDENTIFICATION METHOD"
                    name="idnumber"
                    placeholder="CHOOSE A METHOD"
                    required
                /> */}
                <InputField
                    id="id_number"
                    type="text"
                    label="ID NUMBER"
                    name="id_number"
                    placeholder="ID NUMBER"
                    required
                />
                <SubmitButton value="LOG IN" pendingValue="Processing..." className="w-full bg-app-primary hover:bg-app-secondary/90 text-white h-12 rounded mt-2" />

            </form>

        </>
    )
}

export { RecoverComponent }
