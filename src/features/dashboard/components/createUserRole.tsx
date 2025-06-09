'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ThumbsDown, ThumbsUp } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Icons } from "@/icons/icons";
import { useAction } from "@/context/ActionContext";
import { AddUserSheet } from "@/features/component/AddUserSheet";

const CreateUserRole = () => {
    const [open, setOpen] = useState(false);
    const { setIsOpen } = useAction();

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(true);
        }, 100); // Delay to ensure it's triggered after mount
        return () => clearTimeout(timer);
    }, []);

    const handleClick = (): void => {
        setIsOpen(open);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] min-w-lg p-4 hideClose" >
                <div className="mt-4 space-y-8 ">
                    <div className="flex justify-between bg-[#BD2B12] text-white rounded-xl text-center mb-10 shadow ">
                        <Icons.smallLeftFlowwer />
                        <div className="justify-center items-center text-center flex flex-col space-y-2">
                            <Button className="bg-white rounded-full"
                                onClick={() => setOpen(false)}>
                                <ArrowLeft className="h-5 text-red-500 w-5" />
                            </Button>
                        </div>
                        <Icons.smallRightFlowwer />
                    </div>
                    <div className="space-y-4">
                        <div className="flex text-xl font-semibold justify-center text-center">Create User Role</div>
                        <div className="justify-center text-center">
                            Do <span className="text-red-600">@e</span> want to create a User Account Right Now, You can As well perform this Action at a later Time.
                        </div>
                        <Button onClick={() => handleClick()} className="w-full h-11 bg-black text-white hover:bg-gray-900 group relative overflow-hidden">
                            <span className="transition-opacity duration-300 group-hover:opacity-0">
                                Yes, Create Now
                            </span>
                            <ThumbsUp
                                className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-5 h-5"
                            />
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-11 group relative overflow-hidden"
                            onClick={() => setOpen(false)}
                        >
                            <span className="transition-opacity duration-300 group-hover:opacity-0">
                                No, I'll Do it Later
                            </span>
                            <ThumbsDown
                                className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-5 h-5 text-gray-500"
                            />
                        </Button>

                    </div>
                </div>
                <AddUserSheet />
            </DialogContent>
        </Dialog>
    );
};

export default CreateUserRole;
