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
                <ProBonoForm />
            </SheetContent>
        </Sheet>

    );
}