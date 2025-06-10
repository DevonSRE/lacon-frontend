import { ReactNode, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

type CustomeSheetProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    children?: ReactNode;
};

export function CustomeSheet({ open, setOpen, children }: CustomeSheetProps) {
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="h-screen">
                <div className="space-y-10 p-5 mt-10">
                    <span>
                        <ArrowLeft onClick={() => setOpen(false)} />
                    </span>
                    <div>{children}</div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
