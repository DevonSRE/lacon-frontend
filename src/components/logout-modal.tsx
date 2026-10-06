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
import { LoaderCircle, LogOut } from "lucide-react";
import { useState } from "react";

export default function LogoutModal() {
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    try {
      await deleteSession();
      localStorage.clear();
      // redirect() is not allowed in event handlers; a full load also clears in-memory query/redux state.
      window.location.href = "/signin";
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false); // Reset loading state on error
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "group flex items-center p-6 gap-2 rounded-md h-12 px-4 py-1 text-sm font-semibold transition-colors",
            "text-red-400 hover:text-red-700 hover:bg-red-50"
          )}
        >
          <span className="flex gap-4 items-center text-xs">
            <LogOut className="w-4 h-4 transition-colors group-hover:text-red-700" />
            Log out
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[450px] p-6 space-y-3">
        <DialogTitle className="text-xl text-black font-semibold text-center">
          Logout
        </DialogTitle>
        <DialogDescription className="text-sm text-black text-center">
          Are you sure you want to log out? Any unsaved changes will be lost.
        </DialogDescription>
        <div className="flex justify-center">
          <Icons.exclamation />
        </div>
        <DialogFooter className="flex md:justify-center  gap-6 sm:gap-0">
          <Button
            variant="default"
            size={"lg"}
            disabled={loading}
            className="flex-1 text-xs sm:flex-none "
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
              size={"lg"}
              variant="ghost"
              className="flex-1  text-xs text-primary sm:flex-none"
            >
              CANCEL
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
