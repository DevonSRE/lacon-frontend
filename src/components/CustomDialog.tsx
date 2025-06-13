import { Dialog, DialogContent, } from "@/components/ui/dialog";
import { ReactNode, Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

type CustomeDialigProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    children?: ReactNode;
    className?: string;

};


export function CustomDialog({ open, setOpen, children, className }: CustomeDialigProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={cn("sm:max-w-5xl ", className)}>
                <ScrollArea className="h-[600px]">
                    <div className="">
                        <div>{children}</div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
