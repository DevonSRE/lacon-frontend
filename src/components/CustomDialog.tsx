import { Dialog, DialogContent,} from "@/components/ui/dialog";
import { ReactNode, Dispatch, SetStateAction } from "react";

type CustomeDialigProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    children?: ReactNode;
};



export function CustomDialog({ open, setOpen, children }: CustomeDialigProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <div className="grid gap-4">
                    <div>{children}</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
