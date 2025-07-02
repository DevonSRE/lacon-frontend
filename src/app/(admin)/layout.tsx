"use client";
import AppHeader from "@/layout/AppHeader";
import { setProfile } from "@/redux/slices/profile-slice";
import { getSession } from "@/server/getSession";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar, } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layout/AppSidebar";
// import { AppSidebar } from "@/components/sidebar/app-sidebar";
// import AppSidebar from "@/layout/AppSidebar";

export default function AdminLayout({ children, }: { children: React.ReactNode; }) {
  // const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const dispatch = useDispatch();
  useEffect(() => {
    getSession().then((userData) => {
      if (userData && userData.role) {
        dispatch(setProfile(userData));
      }
    });
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* <Backdrop /> */}
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-8 ">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>

  );
}