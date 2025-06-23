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
                <div className="px-8">
                    {backButton &&
                        <Button variant={"outline"} className="border-none"><ArrowLeft onClick={() => setOpen(false)} /></Button>
                    }
                    <div className="mt-2">{children}</div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
