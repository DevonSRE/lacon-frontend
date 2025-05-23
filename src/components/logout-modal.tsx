"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Icons } from "@/icons/icons";
import { cn } from "@/lib/utils";
import { deleteSession } from "@/server/auth";
import { LoaderCircle } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutModal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleLogout = async (e: any) => {
    console.log("Logout button clicked");
    setLoading(true);
    try {
      await deleteSession();
      // setDialogOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
      redirect('/signin');
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false); // Reset loading state on error
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          className={cn(
            "rounded-md text-neutral-400 hover:bg-gray-100 block py-1 px-4 text-sm font-semibold transition-color"
          )}
        >

          <p className="inline-block relative">Logout</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[450px] p-6 space-y-3">
        <DialogTitle className="text-xl text-black font-semibold text-center">
          Logout
        </DialogTitle>
        <DialogDescription className="text-sm text-black text-center">
          Are you sure you want to log out? Any unsaved changes will be lost..
        </DialogDescription>
        <div className="flex justify-center">
          <Icons.exclamation />
        </div>
        <DialogFooter className="flex md:justify-center gap-4 sm:gap-0">
          <Button
            variant="default"
            size={"lg"}
            disabled={loading}
            className="flex-1 text-xs sm:flex-none"
            onClick={handleLogout}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoaderCircle
                  size={12}
                  className="rotation-loader animate-spin"
                />
                Logging out...
              </div>
            ) : (
              "LOGOUT"
            )}
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="flex-1 text-xs text-primary sm:flex-none"
            >
              CANCEL
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
