import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import ProBonoForm from "./OnlineProLawyerReg";

export default function NewIntake() {
    return (
        <Sheet>
            <SheetTrigger><Button variant="outline">+ New Intake</Button></SheetTrigger>
            <SheetContent className="min-w-2xl">
                <div className="max-w-3xl mx-auto p-10 space-y-8">
                    <ProBonoForm />
                </div>
            </SheetContent>
        </Sheet>

    );
}