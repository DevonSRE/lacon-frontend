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
import { LoaderCircle, LogOut, ArrowRight } from "lucide-react";
import { redirect, useRouter } from "next/navigation";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import LogoutModal from "../logout-modal";
import { useAppSelector } from "@/hooks/redux";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // Add dialog state
  const { data: user } = useAppSelector((state) => state.profile);
  const [name, setName] = useState<string>("");

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  useEffect(() => {
    if (user?.first_name && user?.last_name) {
      setName(`${user.first_name} ${user.last_name}`);
    }
  }, [user]);

  function closeDropdown() {
    setIsOpen(false);
  }

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Logout button clicked");
    setLoading(true);

    try {
      await deleteSession();
      console.log("Session deleted successfully");

      // Small delay to show the loading state
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Close dialog after successful logout
      setDialogOpen(false);
      setLoading(false);

      // Navigate to signin
      window.location.href = '/signin'; // Force a full page redirect
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
      // Keep dialog open on error so user can retry
    }
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle">
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            width={44}
            height={44}
            src="/images/user/owner.jpg"
            alt="User"
          />
        </span>
        <svg className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="">
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
        </div>
        <hr  className="my-2"/>


        <Button
          variant="outline"
          onClick={() => setDialogOpen(true)}
          className={cn(
            "group flex items-center p-6  gap-2 rounded-md h-12 px-4 py-1 text-sm font-semibold transition-colors",
            "text-red-400 hover:text-red-700 hover:bg-red-50"
          )}
        >
          <span className="relative block text-xs">
            <span className="gap-4 flex group-hover:hidden items-center">
              <LogOut className="w-4 h-4 transition-colors group-hover:text-red-700" />
              Log out
            </span>
            <span className="hidden items-center group-hover:block flex-row">
              <div className="flex gap-2 items-center">
                Yes log me out
                <ArrowRight className="w-4 h-4 transition-colors group-hover:text-red-700" />
              </div>
            </span>
          </span>
        </Button>

        {/* Custom Modal Overlay */}
        {dialogOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={(e) => {
              // Only close if not loading and clicked on backdrop
              if (!loading && e.target === e.currentTarget) {
                setDialogOpen(false);
              }
            }}
          >
            <div className="bg-white rounded-lg max-w-[450px] w-full mx-4 p-6 space-y-3">
              <h2 className="text-xl text-black font-semibold text-center">
                Logout
              </h2>
              <p className="text-sm text-black text-center">
                Are you sure you want to log out? Any unsaved changes will be lost.
              </p>
              <div className="flex justify-center">
                <Icons.exclamation />
              </div>
              <div className="flex justify-center gap-6">
                <Button
                  variant="default"
                  size="lg"
                  disabled={loading}
                  className="flex-1 text-xs sm:flex-none"
                  onClick={handleLogout}
                  type="button"
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
                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  className="flex-1 text-xs text-primary sm:flex-none"
                  disabled={loading}
                  onClick={() => !loading && setDialogOpen(false)}
                >
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dropdown>
    </div>
  );
}
