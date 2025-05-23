"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { setProfile } from "@/redux/slices/profile-slice";
import { getSession } from "@/server/getSession";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AdminLayout({ children, }: { children: React.ReactNode; }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const dispatch = useDispatch();
  useEffect(() => {
    getSession().then((userData) => {
      if (userData && userData.role) {
        dispatch(setProfile(userData));
      }
    });
  }, []);

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}>
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
