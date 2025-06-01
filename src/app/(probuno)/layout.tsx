"use client";

import Link from "next/link";
import { ReactNode } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import FileACase from "@/features/probunoLawyers/components/FileACase";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-1 max-w-screen">
      <div className="fixed max-w-screen inset-0 max-h-screen overflow-hidden bg-white">
        {/* Header */}
        <header className="bg-white border-b shadow-sm sticky top-0 left-0 w-full z-50">
          <div className="max-w-7xl w-full mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/dashboard" className="text-xl font-bold text-red-600 flex-shrink-0">
              Dashboard
            </Link>

            <NavigationMenu className="flex-shrink-0">
              <NavigationMenuList className="hidden md:flex gap-4">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
                  <NavigationMenuContent className="p-4">
                    <ul className="space-y-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="#" className={navigationMenuTriggerStyle()}>
                            Vision & Mission
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="#" className={navigationMenuTriggerStyle()}>
                            Leadership
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Departments & Units</NavigationMenuTrigger>
                  <NavigationMenuContent className="p-4">
                    <ul className="space-y-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="#" className={navigationMenuTriggerStyle()}>
                            Legal Aid
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="#" className={navigationMenuTriggerStyle()}>
                            Outreach
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {["Offices", "Resources", "Initiatives", "Media & Gallery", "Forms"].map((item) => (
                  <NavigationMenuItem key={item}>
                    <NavigationMenuLink asChild>
                      <Link href="#" className={navigationMenuTriggerStyle()}>
                        {item}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex gap-2 flex-shrink-0">
             <FileACase />
            </div>

          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex justify-center overflow-x-hidden overflow-y-auto w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
