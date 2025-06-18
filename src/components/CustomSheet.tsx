import { ReactNode, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

type CustomeSheetProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    children?: ReactNode;
    className?: string;
    backButton?: boolean;
};

export function CustomeSheet({ open, setOpen, children, className, backButton = true }: CustomeSheetProps) {
    return (
        <Sheet open={open} onOpenChange={setOpen}  >
            <SheetContent side="right" className={cn("w-full max-h-screen overflow-auto sm:max-w-[450px]", className)} onClick={(e) => e.stopPropagation()}>
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="space-y-10 p-5">
                    {backButton &&
                        <span><ArrowLeft onClick={() => setOpen(false)} /></span>
                    }
                    <div className="mt-4">{children}</div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
