
"use client";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React, { useEffect, useRef } from "react";

const AppHeader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-30 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex grow items-center justify-between gap-4 px-5 py-4 lg:px-6">
        {/*
          Under 768px the sidebar is a sheet (useIsMobile's breakpoint, which
          AppSidebar's Sidebar collapsible="icon" follows) and the rail that
          opens it on a desktop is not rendered. This button is then the only
          way into the navigation, and it was commented out: a phone showed a
          header with nothing in it and no way to reach any page or action.

          It toggles through SidebarTrigger's own useSidebar, the one the
          (admin) layout's SidebarProvider supplies, which is the context
          AppSidebar reads. The header used to import a second useSidebar from
          @/context/SidebarContext and toggle that instead - state nothing on
          this screen renders.
        */}
        <SidebarTrigger className="-ml-1 md:hidden" />
        <div className="flex grow items-center justify-end gap-4">
          <div className="flex items-center gap-2 2xsm:gap-3">
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
