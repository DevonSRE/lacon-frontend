"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";
import FileACase from "@/features/probunoLawyers/components/FileACase";
import { useAction } from "@/context/ActionContext";
import { Button } from "@/components/ui/button";
import { Menu, PlusCircle, X } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { setIsOpen } = useAction();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const publicLinks = [
    { href: "/probono", label: "Pro Bono" },
    { href: "/probono/registration", label: "Register" },
    { href: "/probono/cases", label: "Inventory" },
    { href: "/probono/update", label: "Annual Review" },
    { href: "/signin", label: "Sign In" },
  ];

  return (
    <div className="flex flex-1 max-w-screen">
      <div className="fixed max-w-screen inset-0 max-h-screen overflow-hidden bg-white">
        {/* Header */}
        <header className="bg-white border-b shadow-sm sticky top-0 left-0 w-full z-50">
          <div className="max-w-7xl w-full mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" aria-label="LACON public home page" className="flex items-center gap-2 text-xl font-bold text-red-600 flex-shrink-0">
              <Image src="/logo.png" alt="LACON" width={36} height={36} loading="eager" />
              LACON
            </Link>

            <nav aria-label="Public navigation" className="hidden lg:flex items-center gap-1">
              {publicLinks.map((item) => (
                <Link key={item.href} href={item.href} className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex gap-2 flex-shrink-0">
              <Button onClick={() => setIsOpen(true)} variant="outline" size="lg" className="border-2">
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">File a Case</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(open => !open)}
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
              <FileACase />
            </div>

          </div>
          {mobileMenuOpen && (
            <nav aria-label="Mobile public navigation" className="lg:hidden border-t bg-white px-4 py-3 shadow-sm">
              <div className="mx-auto grid max-w-7xl gap-1">
                {publicLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </header>

        {/* Main Content Area */}
        <main className="overflow-x-hidden overflow-y-auto w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
